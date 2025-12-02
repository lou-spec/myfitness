import express from "express";
import Client from "../models/Client.js";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";
import { checkClientLimit } from "../middleware/planMiddleware.js";
import { sendClientWelcomeEmail, sendTrainerNotification } from "../utils/emailService.js";

const router = express.Router();

// GET - Listar todos os clientes do trainer
router.get("/", auth, async (req, res) => {
  try {
    const clients = await Client.find({ trainer_id: req.user.id }).sort({ created_at: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar clientes", error: err.message });
  }
});

// POST - Criar novo cliente
router.post("/", auth, checkClientLimit, async (req, res) => {
  try {
    const { name, email, phone, notes, medical_info } = req.body;

    const client = await Client.create({
      trainer_id: req.user.id,
      name,
      email,
      phone,
      notes,
      medical_info,
    });

    // Buscar informações do trainer para enviar no email
    const trainer = await User.findById(req.user.id).select("-password");

    // Enviar emails de boas-vindas (não bloquear resposta)
    if (process.env.EMAIL_USER && trainer) {
      sendClientWelcomeEmail(email, name, trainer).catch(err => 
        console.error("Erro ao enviar email ao cliente:", err)
      );
      sendTrainerNotification(trainer.email, trainer.name, name, email).catch(err =>
        console.error("Erro ao enviar email ao trainer:", err)
      );
    }

    res.json({ msg: "Cliente criado com sucesso", client });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao criar cliente", error: err.message });
  }
});

// GET - Buscar cliente específico
router.get("/:id", auth, async (req, res) => {
  try {
    const client = await Client.findOne({ 
      _id: req.params.id, 
      trainer_id: req.user.id 
    });

    if (!client) {
      return res.status(404).json({ msg: "Cliente não encontrado" });
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar cliente", error: err.message });
  }
});

// PUT - Atualizar cliente
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, email, phone, notes, medical_info } = req.body;

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, trainer_id: req.user.id },
      { name, email, phone, notes, medical_info },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ msg: "Cliente não encontrado" });
    }

    res.json({ msg: "Cliente atualizado", client });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao atualizar cliente", error: err.message });
  }
});

// DELETE - Remover cliente
router.delete("/:id", auth, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ 
      _id: req.params.id, 
      trainer_id: req.user.id 
    });

    if (!client) {
      return res.status(404).json({ msg: "Cliente não encontrado" });
    }

    res.json({ msg: "Cliente removido com sucesso" });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao remover cliente", error: err.message });
  }
});

// POST - Associar um User (role client) como cliente do trainer
router.post("/associate-user", auth, checkClientLimit, async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ msg: "ID do utilizador é obrigatório" });
    }

    // Verificar se o user existe e é do tipo client
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ msg: "Utilizador não encontrado" });
    }

    if (user.role !== "client") {
      return res.status(400).json({ msg: "Este utilizador não é um cliente" });
    }

    // Verificar se já está associado
    if (user.trainer_id && user.trainer_id.toString() === req.user.id) {
      return res.status(400).json({ msg: "Este cliente já está associado a ti" });
    }

    // Associar o trainer ao user
    user.trainer_id = req.user.id;
    await user.save();

    // Buscar informações do trainer
    const trainer = await User.findById(req.user.id).select("-password");

    // Enviar email de boas-vindas (não bloquear resposta)
    if (process.env.EMAIL_USER && trainer) {
      sendClientWelcomeEmail(user.email, user.name, trainer).catch(err => 
        console.error("Erro ao enviar email ao cliente:", err)
      );
    }

    res.json({ 
      msg: `${user.name} foi associado como teu cliente!`,
      client: user
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao associar cliente", error: err.message });
  }
});

// POST - Desassociar/Remover um cliente do trainer
router.post("/dissociate-user/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar o user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Utilizador não encontrado" });
    }

    // Verificar se está associado a este trainer
    if (!user.trainer_id || user.trainer_id.toString() !== req.user.id) {
      return res.status(400).json({ msg: "Este cliente não está associado a ti" });
    }

    // Remover a associação
    user.trainer_id = null;
    await user.save();

    res.json({ 
      msg: `${user.name} foi removido da tua lista de clientes`,
      user
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao desassociar cliente", error: err.message });
  }
});

export default router;
