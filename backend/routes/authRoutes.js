import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/authMiddleware.js";
import { checkTrainerClientLimit } from "../middleware/planMiddleware.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Preenche todos os campos obrigatórios" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ msg: "Email já existe" });

    const hashed = await bcrypt.hash(password, 10);

    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 dias

    const userRole = role || "trainer"; // Default é trainer
    const isTrainer = userRole === "trainer";

    const userData = { 
      name, 
      email, 
      password: hashed,
      phone: phone || null,
      role: userRole
    };

    // Se for trainer, adiciona campos de trial
    if (isTrainer) {
      userData.subscription_plan = "trial";
      userData.trial_start_date = now;
      userData.trial_end_date = trialEndDate;
      userData.subscription_active = true;
      userData.trial_warning_sent = false;
    }

    const user = await User.create(userData);
    
    res.json({ msg: "Registado com sucesso" });
  } catch (err) {
    console.error("Erro no registo:", err);
    res.status(500).json({ msg: "Erro ao criar conta", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Conta não existe" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Password inválida" });

  // Se for trainer, verifica se o trial expirou
  if (user.role === 'trainer' && user.subscription_plan === 'trial') {
    const now = new Date();
    if (user.trial_end_date && now > user.trial_end_date) {
      // Trial expirado - não permite login
      return res.status(403).json({ 
        msg: "Período experimental expirado. Faça upgrade para continuar.",
        trialExpired: true,
        trialEndDate: user.trial_end_date
      });
    }
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.json({
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email,
      role: user.role,
      phone: user.phone,
      trainer_id: user.trainer_id,
      subscription_plan: user.subscription_plan,
      trial_end_date: user.trial_end_date
    },
  });
});

// GET TRAINER INFO
router.get("/trainer/:id", async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id).select("-password");
    if (!trainer) {
      return res.status(404).json({ msg: "Trainer não encontrado" });
    }
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar trainer", error: err.message });
  }
});

// GET ALL USERS WITH ROLE CLIENT
router.get("/users-clients", async (req, res) => {
  try {
    const users = await User.find({ role: "client" }).select("-password").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar utilizadores", error: err.message });
  }
});

// UPDATE USER PROFILE
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, phone, city, bio, specialties, price_per_session, photo_url } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        city,
        bio,
        specialties,
        price_per_session,
        photo_url,
      },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "Utilizador não encontrado" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao atualizar perfil", error: err.message });
  }
});

// GET ALL TRAINERS (para clientes escolherem)
router.get("/trainers", async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" })
      .select("name email photo_url city specialties bio price_per_session")
      .sort({ name: 1 });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar trainers", error: err.message });
  }
});

// GET USER BY ID (para trainers verem detalhes de clientes associados)
router.get("/user/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "Utilizador não encontrado" });
    }

    // Se for trainer, só pode ver seus próprios clientes
    if (req.user.role === "trainer") {
      if (user.role !== "client" || user.trainer_id?.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Não tens permissão para ver este utilizador" });
      }
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar utilizador", error: err.message });
  }
});

// ASSOCIATE CLIENT WITH TRAINER
router.post("/associate-trainer", checkTrainerClientLimit, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { trainer_id } = req.body;
    if (!trainer_id) return res.status(400).json({ msg: "ID do trainer é obrigatório" });

    // Verificar se o trainer existe
    const trainer = await User.findById(trainer_id);
    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ msg: "Personal trainer não encontrado" });
    }

    // Atualizar o cliente
    const user = await User.findByIdAndUpdate(
      userId,
      { trainer_id },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "Utilizador não encontrado" });

    res.json({ 
      msg: "Associado com sucesso ao personal trainer!",
      user 
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao associar trainer", error: err.message });
  }
});

export default router;
