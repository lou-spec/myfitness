import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB conectado\n");
    
    // Buscar todos os trainers sem trial configurado
    const trainersWithoutTrial = await User.find({ 
      role: "trainer",
      $or: [
        { subscription_plan: { $exists: false } },
        { subscription_plan: null },
        { trial_start_date: { $exists: false } }
      ]
    });
    
    console.log(`📊 Encontrados ${trainersWithoutTrial.length} trainers sem trial configurado\n`);
    
    if (trainersWithoutTrial.length === 0) {
      console.log("✅ Todos os trainers já têm trial configurado!");
      mongoose.connection.close();
      process.exit(0);
      return;
    }
    
    for (const trainer of trainersWithoutTrial) {
      const now = new Date();
      // Trial de 14 dias a partir de AGORA
      const trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      
      trainer.subscription_plan = "trial";
      trainer.trial_start_date = now;
      trainer.trial_end_date = trialEndDate;
      trainer.subscription_active = true;
      trainer.trial_warning_sent = false;
      
      await trainer.save();
      
      console.log(`✅ Trial configurado para: ${trainer.name} (${trainer.email})`);
      console.log(`   Trial Start: ${now.toLocaleString("pt-PT")}`);
      console.log(`   Trial End: ${trialEndDate.toLocaleString("pt-PT")}`);
      console.log(`   ⏰ 14 dias de trial a partir de AGORA\n`);
    }
    
    console.log("\n🎉 Todos os trainers atualizados com sucesso!");
    console.log("⏰ O cron job irá verificar e enviar emails em breve...");
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro:", err);
    process.exit(1);
  });
