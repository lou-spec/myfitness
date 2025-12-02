import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import { sendTrialWarningEmail, sendTrialExpiredEmail } from "./utils/emailService.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB conectado\n");
    console.log("🔍 Forçando verificação de trials AGORA...\n");
    
    const now = new Date();
    
    // Busca trainers para email de aviso (13 dias após trial_start_date)
    const warningTime = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000); // 13 dias atrás
    
    const trainersForWarning = await User.find({
      role: 'trainer',
      subscription_plan: 'trial',
      trial_warning_sent: false,
      trial_start_date: { $lte: warningTime },
      trial_end_date: { $gt: now }
    });

    console.log(`📊 Trainers para aviso: ${trainersForWarning.length}`);
    
    for (const trainer of trainersForWarning) {
      const timeRemaining = trainer.trial_end_date - now;
      const secondsRemaining = Math.floor(timeRemaining / 1000);
      
      console.log(`\n⚠️ ${trainer.name} (${trainer.email})`);
      console.log(`   Trial Start: ${trainer.trial_start_date}`);
      console.log(`   Trial End: ${trainer.trial_end_date}`);
      console.log(`   Tempo restante: ${secondsRemaining}s`);
      
      try {
        await sendTrialWarningEmail(trainer);
        trainer.trial_warning_sent = true;
        await trainer.save();
        console.log(`   ✅ Email de aviso enviado!`);
      } catch (emailErr) {
        console.error(`   ❌ Erro ao enviar email:`, emailErr.message);
      }
    }

    // Busca trainers com trial expirado
    const expiredTrainers = await User.find({
      role: 'trainer',
      subscription_plan: 'trial',
      trial_end_date: { $lte: now },
      subscription_active: true
    });

    console.log(`\n📊 Trainers expirados: ${expiredTrainers.length}`);

    for (const trainer of expiredTrainers) {
      console.log(`\n🚫 ${trainer.name} (${trainer.email})`);
      console.log(`   Trial expirou em: ${trainer.trial_end_date}`);
      
      try {
        await sendTrialExpiredEmail(trainer);
        trainer.subscription_active = false;
        await trainer.save();
        console.log(`   ✅ Email de expiração enviado e conta desativada!`);
      } catch (emailErr) {
        console.error(`   ❌ Erro:`, emailErr.message);
      }
    }

    if (trainersForWarning.length === 0 && expiredTrainers.length === 0) {
      console.log("\n✅ Nenhum trainer precisa de notificação no momento");
      
      // Mostra todos os trainers em trial
      const allTrialTrainers = await User.find({
        role: 'trainer',
        subscription_plan: 'trial'
      }).select('name email trial_start_date trial_end_date trial_warning_sent subscription_active');
      
      if (allTrialTrainers.length > 0) {
        console.log("\n📋 Trainers em Trial:\n");
        allTrialTrainers.forEach(trainer => {
          console.log(`• ${trainer.name} (${trainer.email})`);
          console.log(`  Start: ${trainer.trial_start_date || "N/A"}`);
          console.log(`  End: ${trainer.trial_end_date || "N/A"}`);
          console.log(`  Warning Sent: ${trainer.trial_warning_sent}`);
          console.log(`  Active: ${trainer.subscription_active}`);
          
          if (trainer.trial_start_date && trainer.trial_end_date) {
            const timeFromStart = now - trainer.trial_start_date;
            const timeToEnd = trainer.trial_end_date - now;
            console.log(`  Tempo desde início: ${Math.floor(timeFromStart / 1000)}s`);
            console.log(`  Tempo até expirar: ${Math.floor(timeToEnd / 1000)}s`);
          }
          console.log("");
        });
      }
    }
    
    console.log("\n✅ Verificação completa!");
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro:", err);
    process.exit(1);
  });
