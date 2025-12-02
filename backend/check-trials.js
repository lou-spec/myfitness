import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB conectado");
    
    // Buscar todos os trainers
    const trainers = await User.find({ role: "trainer" })
      .select("name email subscription_plan trial_start_date trial_end_date subscription_active trial_warning_sent created_at")
      .sort({ created_at: -1 })
      .limit(5);
    
    console.log("\n📊 Últimos 5 Trainers Registados:\n");
    
    trainers.forEach((trainer, index) => {
      console.log(`${index + 1}. ${trainer.name} (${trainer.email})`);
      console.log(`   Plan: ${trainer.subscription_plan || "N/A"}`);
      console.log(`   Trial Start: ${trainer.trial_start_date || "N/A"}`);
      console.log(`   Trial End: ${trainer.trial_end_date || "N/A"}`);
      console.log(`   Active: ${trainer.subscription_active !== undefined ? trainer.subscription_active : "N/A"}`);
      console.log(`   Warning Sent: ${trainer.trial_warning_sent || false}`);
      console.log(`   Registered: ${trainer.created_at}`);
      
      if (trainer.trial_end_date) {
        const now = new Date();
        const timeLeft = trainer.trial_end_date - now;
        const secondsLeft = Math.floor(timeLeft / 1000);
        console.log(`   ⏰ Tempo restante: ${secondsLeft > 0 ? secondsLeft + "s" : "EXPIRADO"}`);
      }
      console.log("");
    });
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro:", err);
    process.exit(1);
  });
