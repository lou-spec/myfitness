import express from "express";
import AvailabilitySlot from "../models/AvailabilitySlot.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// GET - Listar disponibilidade do trainer (público ou autenticado)
router.get("/", async (req, res) => {
  try {
    const { trainer_id } = req.query;

    if (!trainer_id) {
      return res.status(400).json({ msg: "trainer_id é obrigatório" });
    }

    const slots = await AvailabilitySlot.find({ trainer_id }).sort({ weekday: 1, start_time: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar disponibilidade", error: err.message });
  }
});

// POST - Criar nova disponibilidade
router.post("/", auth, async (req, res) => {
  try {
    const { weekday, start_time, end_time, recurring } = req.body;

    // Verificar se já existe conflito
    const existing = await AvailabilitySlot.findOne({
      trainer_id: req.user.id,
      weekday,
      $or: [
        { start_time: { $lte: start_time }, end_time: { $gt: start_time } },
        { start_time: { $lt: end_time }, end_time: { $gte: end_time } },
      ],
    });

    if (existing) {
      return res.status(400).json({ msg: "Conflito de horário detectado" });
    }

    const slot = await AvailabilitySlot.create({
      trainer_id: req.user.id,
      weekday,
      start_time,
      end_time,
      recurring,
    });

    res.json({ msg: "Disponibilidade criada", slot });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao criar disponibilidade", error: err.message });
  }
});

// DELETE - Remover disponibilidade
router.delete("/:id", auth, async (req, res) => {
  try {
    const slot = await AvailabilitySlot.findOneAndDelete({
      _id: req.params.id,
      trainer_id: req.user.id,
    });

    if (!slot) {
      return res.status(404).json({ msg: "Disponibilidade não encontrada" });
    }

    res.json({ msg: "Disponibilidade removida" });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao remover disponibilidade", error: err.message });
  }
});

export default router;
