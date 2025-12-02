import express from "express";
import Payment from "../models/Payment.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET payments do trainer
router.get("/", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ trainer_id: req.user.id })
      .populate("appointment_id")
      .sort({ created_at: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar pagamentos", error: err.message });
  }
});

// GET estatísticas de pagamentos
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ trainer_id: req.user.id });
    
    const total = payments.reduce((sum, p) => p.status === "succeeded" ? sum + p.amount : sum, 0);
    const pending = payments.filter(p => p.status === "pending").length;
    const succeeded = payments.filter(p => p.status === "succeeded").length;
    
    // Receita por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentPayments = await Payment.find({
      trainer_id: req.user.id,
      status: "succeeded",
      created_at: { $gte: sixMonthsAgo }
    });
    
    const monthlyRevenue = {};
    recentPayments.forEach(p => {
      const month = new Date(p.created_at).toLocaleDateString("pt-PT", { year: "numeric", month: "short" });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + p.amount;
    });
    
    res.json({
      total,
      pending,
      succeeded,
      monthlyRevenue
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao calcular estatísticas", error: err.message });
  }
});

// CREATE payment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { appointment_id, amount, currency } = req.body;
    
    const payment = await Payment.create({
      appointment_id,
      trainer_id: req.user.id,
      amount,
      currency: currency || "EUR",
    });
    
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao criar pagamento", error: err.message });
  }
});

// UPDATE payment status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, trainer_id: req.user.id },
      { status },
      { new: true }
    );
    
    if (!payment) return res.status(404).json({ msg: "Pagamento não encontrado" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao atualizar pagamento", error: err.message });
  }
});

export default router;
