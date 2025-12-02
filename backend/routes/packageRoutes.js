import express from "express";
import Package from "../models/Package.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET packages do trainer
router.get("/", authMiddleware, async (req, res) => {
  try {
    const packages = await Package.find({ trainer_id: req.user.id, active: true });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar pacotes", error: err.message });
  }
});

// GET packages públicos de um trainer (com dados do trainer)
router.get("/trainer/:trainerId", async (req, res) => {
  try {
    console.log("A buscar pacotes do trainer:", req.params.trainerId);
    const packages = await Package.find({ 
      trainer_id: req.params.trainerId, 
      active: true 
    }).populate('trainer_id', 'name email photo_url city specialties bio price_per_session phone');
    console.log("Pacotes encontrados:", packages.length);
    res.json(packages);
  } catch (err) {
    console.error("Erro ao buscar pacotes:", err);
    res.status(500).json({ msg: "Erro ao buscar pacotes", error: err.message });
  }
});

// CREATE package
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, sessions_count, price, description } = req.body;
    
    const pkg = await Package.create({
      trainer_id: req.user.id,
      title,
      sessions_count,
      price,
      description,
    });
    
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao criar pacote", error: err.message });
  }
});

// UPDATE package
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const pkg = await Package.findOneAndUpdate(
      { _id: req.params.id, trainer_id: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!pkg) return res.status(404).json({ msg: "Pacote não encontrado" });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao atualizar pacote", error: err.message });
  }
});

// DELETE (desativar) package
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const pkg = await Package.findOneAndUpdate(
      { _id: req.params.id, trainer_id: req.user.id },
      { active: false },
      { new: true }
    );
    
    if (!pkg) return res.status(404).json({ msg: "Pacote não encontrado" });
    res.json({ msg: "Pacote desativado" });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao desativar pacote", error: err.message });
  }
});

export default router;
