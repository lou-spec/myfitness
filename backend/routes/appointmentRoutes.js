import express from "express";
import Appointment from "../models/Appointment.js";
import Client from "../models/Client.js";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";
import checkTrialStatus from "../middleware/checkTrialStatus.js";
import { 
  sendAppointmentConfirmation, 
  sendCancellationEmail, 
  sendSessionCompletedEmail,
  sendClientCancellationNotification 
} from "../utils/emailService.js";

const router = express.Router();

// GET - Listar agendamentos do trainer
router.get("/", auth, checkTrialStatus, async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = { trainer_id: req.user.id };

    if (status) query.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.start_datetime = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(query)
      .populate("client_id")
      .sort({ start_datetime: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar agendamentos", error: err.message });
  }
});

// POST - Criar novo agendamento (pode ser público ou autenticado)
router.post("/", async (req, res) => {
  try {
    const { 
      trainer_id, 
      client_name, 
      client_email, 
      client_phone,
      start_datetime, 
      end_datetime,
      notes 
    } = req.body;

    // Verificar conflito de horário
    const conflict = await Appointment.findOne({
      trainer_id,
      status: { $ne: "cancelled" },
      $or: [
        { start_datetime: { $lt: end_datetime }, end_datetime: { $gt: start_datetime } },
      ],
    });

    if (conflict) {
      return res.status(400).json({ msg: "Horário já reservado" });
    }

    // Verificar ou criar cliente
    let client = await Client.findOne({ email: client_email, trainer_id });
    if (!client) {
      client = await Client.create({
        trainer_id,
        name: client_name,
        email: client_email,
        phone: client_phone,
      });
    }

    const appointment = await Appointment.create({
      trainer_id,
      client_id: client._id,
      client_name,
      client_email,
      client_phone,
      start_datetime,
      end_datetime,
      notes,
    });

    // Buscar trainer e enviar email de confirmação
    if (process.env.EMAIL_USER) {
      const trainer = await User.findById(trainer_id).select("-password");
      if (trainer) {
        sendAppointmentConfirmation(client_email, client_name, appointment, trainer).catch(err =>
          console.error("Erro ao enviar email de confirmação:", err)
        );
      }
    }

    res.json({ msg: "Agendamento criado", appointment });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao criar agendamento", error: err.message });
  }
});

// PATCH - Atualizar status do agendamento
router.patch("/:id", auth, async (req, res) => {
  try {
    const { status, notes, workout_notes, payment_status, client_rating, client_feedback, cancellation_reason } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (workout_notes !== undefined) updateData.workout_notes = workout_notes;
    if (payment_status) updateData.payment_status = payment_status;
    if (client_rating) updateData.client_rating = client_rating;
    if (client_feedback) updateData.client_feedback = client_feedback;
    if (cancellation_reason) updateData.cancellation_reason = cancellation_reason;

    // Buscar agendamento (aceitar tanto trainer_id quanto client_email para clientes cancelarem)
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ msg: "Agendamento não encontrado" });
    }

    // Verificar permissões: trainer pode atualizar tudo, cliente só pode cancelar suas próprias sessões
    const user = await User.findById(req.user.id);
    const isTrainer = appointment.trainer_id.toString() === req.user.id;
    const isClient = user.role === 'client' && user.email === appointment.client_email;
    
    console.log("🔍 Verificação de permissões:", {
      userId: req.user.id,
      userEmail: user.email,
      userRole: user.role,
      appointmentTrainerId: appointment.trainer_id.toString(),
      appointmentClientEmail: appointment.client_email,
      isTrainer,
      isClient
    });
    
    if (!isTrainer && !isClient) {
      return res.status(403).json({ msg: "Não tens permissão para atualizar este agendamento" });
    }

    // Cliente só pode cancelar
    if (isClient && status && status !== 'cancelled') {
      return res.status(403).json({ msg: "Clientes só podem cancelar sessões" });
    }

    // Atualizar o appointment
    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Enviar emails baseado nas mudanças
    if (process.env.EMAIL_USER) {
      const trainer = await User.findById(appointment.trainer_id).select("-password");
      
      console.log("📧 Verificação de emails:", {
        hasTrainer: !!trainer,
        hasStatus: !!status,
        status,
        isClient,
        hasCancellationReason: !!cancellation_reason
      });
      
      if (trainer && status) {
        if (status === "cancelled") {
          console.log("✉️ Iniciando envio de emails de cancelamento...");
          
          // Se foi o cliente que cancelou, enviar email ao trainer
          if (isClient && cancellation_reason) {
            console.log(`📤 Enviando email ao trainer: ${trainer.email}`);
            sendClientCancellationNotification(
              trainer.email,
              trainer.name,
              appointment,
              user,
              cancellation_reason
            ).catch(err => console.error("❌ Erro ao enviar email ao trainer:", err));
          } else {
            console.log("⚠️ Email ao trainer não enviado:", { isClient, hasCancellationReason: !!cancellation_reason });
          }
          
          // Sempre enviar email ao cliente sobre o cancelamento
          console.log(`📤 Enviando email ao cliente: ${appointment.client_email}`);
          sendCancellationEmail(
            appointment.client_email, 
            appointment.client_name, 
            appointment, 
            trainer
          ).catch(err => console.error("❌ Erro ao enviar email ao cliente:", err));
        } else if (status === "done") {
          sendSessionCompletedEmail(
            appointment.client_email, 
            appointment.client_name, 
            appointment, 
            trainer
          ).catch(err => console.error("Erro ao enviar email:", err));
        }
      }
    }

    res.json({ msg: "Agendamento atualizado", appointment });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao atualizar agendamento", error: err.message });
  }
});

// GET - Dashboard stats
router.get("/stats/dashboard", auth, checkTrialStatus, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalClients = await Client.countDocuments({ trainer_id: req.user.id });
    
    const appointmentsThisMonth = await Appointment.countDocuments({
      trainer_id: req.user.id,
      start_datetime: { $gte: startOfMonth },
    });

    const upcomingAppointments = await Appointment.find({
      trainer_id: req.user.id,
      start_datetime: { $gte: now },
      status: "booked",
    })
      .limit(5)
      .sort({ start_datetime: 1 });

    res.json({
      totalClients,
      appointmentsThisMonth,
      upcomingAppointments,
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar estatísticas", error: err.message });
  }
});

// GET - My appointments (for clients)
router.get("/my", auth, async (req, res) => {
  try {
    const User = await import("../models/User.js");
    const user = await User.default.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: "Utilizador não encontrado" });
    }

    // Se for trainer, retorna os agendamentos dele
    if (user.role === "trainer") {
      const appointments = await Appointment.find({ trainer_id: req.user.id })
        .sort({ start_datetime: -1 });
      return res.json(appointments);
    }

    // Se for cliente, retorna agendamentos dele
    const appointments = await Appointment.find({ client_email: user.email })
      .sort({ start_datetime: -1 });
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao buscar agendamentos", error: err.message });
  }
});

export default router;
