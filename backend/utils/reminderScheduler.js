import dotenv from "dotenv";
import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendAppointmentReminder } from "./emailService.js";

// Garantir que .env é carregado
dotenv.config();

// Executar todos os dias às 10:00 AM
export const startReminderScheduler = () => {
  // Formato: segundo minuto hora dia mês dia-da-semana
  cron.schedule("0 10 * * *", async () => {
    console.log("🔔 Verificando lembretes de sessões...");

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Buscar sessões agendadas para amanhã
      const appointments = await Appointment.find({
        start_datetime: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow,
        },
        status: "booked",
      });

      console.log(`📅 Encontradas ${appointments.length} sessões para amanhã`);

      // Enviar lembretes
      for (const appointment of appointments) {
        const trainer = await User.findById(appointment.trainer_id).select("-password");
        
        if (trainer && process.env.EMAIL_USER) {
          await sendAppointmentReminder(
            appointment.client_email,
            appointment.client_name,
            appointment,
            trainer
          );
        }
      }
    } catch (error) {
      console.error("❌ Erro lembretes:", error.message);
    }
  });
};

// Função para enviar lembretes manualmente (teste)
export const sendTestReminders = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      start_datetime: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow,
      },
      status: "booked",
    });

    console.log(`📅 Teste: ${appointments.length} sessões para amanhã`);

    for (const appointment of appointments) {
      const trainer = await User.findById(appointment.trainer_id).select("-password");
      
      if (trainer) {
        await sendAppointmentReminder(
          appointment.client_email,
          appointment.client_name,
          appointment,
          trainer
        );
      }
    }

    console.log("✅ Teste concluído!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
};
