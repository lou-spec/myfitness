import User from '../models/User.js';

/**
 * Middleware para verificar se o trial do trainer expirou
 * Para modo de TESTE: trial = 10 segundos, expira após 60 segundos total
 * Para modo PRODUÇÃO: trial = 14 dias
 */
const checkTrialStatus = async (req, res, next) => {
  try {
    // Apenas verifica trainers
    if (req.user.role !== 'trainer') {
      return next();
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Utilizador não encontrado' });
    }

    // Se já tem plano pago (não é trial), libera acesso
    if (user.subscription_plan !== 'trial') {
      return next();
    }

    // Verifica se o trial expirou
    const now = new Date();
    
    if (user.trial_end_date && now > user.trial_end_date) {
      // Trial expirado - bloqueia acesso
      user.subscription_active = false;
      await user.save();
      
      return res.status(403).json({ 
        msg: 'Período experimental expirado',
        trialExpired: true,
        trialEndDate: user.trial_end_date
      });
    }

    // Trial ainda ativo - permite continuar
    next();
  } catch (err) {
    console.error('Erro no middleware de trial:', err);
    res.status(500).json({ msg: 'Erro ao verificar status da subscrição' });
  }
};

export default checkTrialStatus;
