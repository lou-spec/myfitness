import cron from 'node-cron';
import User from '../models/User.js';
import { sendTrialWarningEmail, sendTrialExpiredEmail } from '../utils/emailService.js';

/**
 * Cron job para verificar trials e enviar emails de aviso
 * Roda diariamente às 10:00 AM
 * Envia email de aviso aos 13 dias (falta 1 dia)
 * Desativa conta aos 14 dias
 */
const startTrialCheckScheduler = () => {
  // Roda diariamente às 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('🔍 Verificando trials de trainers...');
      
      const now = new Date();
      
      // Busca trainers com trial que começou há 13 dias (para enviar aviso)
      const warningTime = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000); // 13 dias atrás
      
      const trainersForWarning = await User.find({
        role: 'trainer',
        subscription_plan: 'trial',
        trial_warning_sent: false,
        trial_start_date: { $lte: warningTime },
        trial_end_date: { $gt: now } // Trial ainda não expirou
      });

      for (const trainer of trainersForWarning) {
        const timeRemaining = trainer.trial_end_date - now;
        const secondsRemaining = Math.floor(timeRemaining / 1000);
        
        console.log(`⚠️ Enviando email de aviso para ${trainer.email} (restam ${secondsRemaining}s)`);
        
        try {
          await sendTrialWarningEmail(trainer);
          trainer.trial_warning_sent = true;
          await trainer.save();
          console.log(`✅ Email de aviso enviado para ${trainer.email}`);
        } catch (emailErr) {
          console.error(`❌ Erro ao enviar email para ${trainer.email}:`, emailErr);
        }
      }

      // Busca trainers com trial expirado para desativar
      const expiredTrainers = await User.find({
        role: 'trainer',
        subscription_plan: 'trial',
        trial_end_date: { $lte: now },
        subscription_active: true
      });

      for (const trainer of expiredTrainers) {
        console.log(`🚫 Trial expirado para ${trainer.email}`);
        
        try {
          await sendTrialExpiredEmail(trainer);
          trainer.subscription_active = false;
          await trainer.save();
          console.log(`✅ Email de expiração enviado e conta desativada: ${trainer.email}`);
        } catch (emailErr) {
          console.error(`❌ Erro ao processar expiração para ${trainer.email}:`, emailErr);
        }
      }

      if (trainersForWarning.length === 0 && expiredTrainers.length === 0) {
        console.log('✅ Nenhum trainer precisa de notificação no momento');
      }
      
    } catch (err) {
      console.error('❌ Erro no cron job de verificação de trials:', err);
    }
  });

  console.log('⏰ Scheduler de verificação de trials iniciado (10:00 AM diariamente)');
};

export default startTrialCheckScheduler;
