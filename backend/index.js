import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import { startReminderScheduler } from "./utils/reminderScheduler.js";
import startTrialCheckScheduler from "./services/trialCheckScheduler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/email", emailRoutes);

// Rota especial para webhook do Stripe (antes do express.json())
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
app.use("/api/subscription", subscriptionRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ msg: "API Personal Trainer - MVP v1.0" });
});

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB conectado");
    
    // Iniciar servidor
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor a correr na porta ${process.env.PORT}`);
      
      // Iniciar schedulers
      if (process.env.EMAIL_USER) {
        startReminderScheduler();
        startTrialCheckScheduler();
        console.log("📧 Sistema de emails ativado");
        console.log("⏰ Verificação de trials iniciada");
      } else {
        console.log("⚠️ Sistema de emails desativado (configure EMAIL_USER no .env)");
      }
    });
  })
  .catch((err) => console.log("❌ Erro MongoDB:", err));
