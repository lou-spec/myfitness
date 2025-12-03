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
import contactRoutes from "./routes/contactRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import { startReminderScheduler } from "./utils/reminderScheduler.js";
import startTrialCheckScheduler from "./services/trialCheckScheduler.js";

dotenv.config();

const app = express();

// CORS otimizado para produção
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    'https://myfitness-neon.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/debug", debugRoutes);

// Rota especial para webhook do Stripe (antes do express.json())
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
app.use("/api/subscription", subscriptionRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ msg: "API Personal Trainer - MVP v1.0" });
});

// Conexão MongoDB Atlas
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error("❌ MONGO_URI não definida! Configure a variável de ambiente.");
    }
    
    // Se a URI não tem database name, adiciona 'test'
    if (!mongoUri.includes('mongodb.net/') || mongoUri.match(/mongodb\.net\/\?/)) {
      mongoUri = mongoUri.replace('mongodb.net/?', 'mongodb.net/test?');
      mongoUri = mongoUri.replace('mongodb.net/', 'mongodb.net/test');
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log("✅ MongoDB conectado:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("❌ Erro ao conectar MongoDB:", err.message);
    console.error("💡 Verifique: 1) Connection string correta, 2) IP whitelisted, 3) Password correta");
    process.exit(1);
  }
};

connectDB().then(() => {
    
    // Iniciar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor na porta ${PORT}`);
      
      if (process.env.EMAIL_USER) {
        startReminderScheduler();
        startTrialCheckScheduler();
      }
    });
}).catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
