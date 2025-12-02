import { canAddClient, hasFeature, getPlanLimits } from '../config/plans.js';
import User from '../models/User.js';

// Middleware para verificar limite de clientes (usado quando o trainer adiciona)
export const checkClientLimit = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const trainer = await User.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer não encontrado' });
    }

    // Contar clientes associados
    const clientCount = trainer.associatedClients?.length || 0;

    if (!canAddClient(trainer, clientCount)) {
      const limits = getPlanLimits(trainer.subscription_plan);
      return res.status(403).json({ 
        message: `Limite de clientes atingido! O plano ${limits.name} permite até ${limits.features.max_clients} clientes.`,
        upgrade_required: true,
        current_plan: trainer.subscription_plan,
        client_limit: limits.features.max_clients,
        current_clients: clientCount
      });
    }

    next();
  } catch (error) {
    console.error('❌ Erro ao verificar limite:', error);
    res.status(500).json({ message: 'Erro ao verificar limites' });
  }
};

// Middleware para verificar limite de clientes do trainer especificado no body (usado quando cliente se associa)
export const checkTrainerClientLimit = async (req, res, next) => {
  try {
    const trainerId = req.body.trainer_id;

    if (!trainerId) {
      return res.status(400).json({ message: 'ID do trainer é obrigatório' });
    }

    const trainer = await User.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer não encontrado' });
    }

    if (trainer.role !== 'trainer') {
      return res.status(400).json({ message: 'Este utilizador não é um trainer' });
    }

    // Contar clientes associados
    const clientCount = trainer.associatedClients?.length || 0;

    if (!canAddClient(trainer, clientCount)) {
      const limits = getPlanLimits(trainer.subscription_plan);
      return res.status(403).json({ 
        message: `Este trainer atingiu o limite de clientes do plano ${limits.name}.`,
        trainer_limit_reached: true,
        trainer_plan: trainer.subscription_plan,
        client_limit: limits.features.max_clients,
        current_clients: clientCount
      });
    }

    next();
  } catch (error) {
    console.error('❌ Erro ao verificar limite do trainer:', error);
    res.status(500).json({ message: 'Erro ao verificar limites' });
  }
};

// Middleware para verificar feature específica
export const checkFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Utilizador não encontrado' });
      }

      if (!hasFeature(user, featureName)) {
        const limits = getPlanLimits(user.subscription_plan);
        return res.status(403).json({ 
          message: `Esta funcionalidade não está disponível no plano ${limits.name}`,
          feature_required: featureName,
          upgrade_required: true,
          current_plan: user.subscription_plan
        });
      }

      next();
    } catch (error) {
      console.error('❌ Erro ao verificar feature:', error);
      res.status(500).json({ message: 'Erro ao verificar permissões' });
    }
  };
};

// Middleware para verificar assinatura ativa
export const checkActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    // Se está no trial, verificar se expirou
    if (user.subscription_plan === 'trial') {
      const now = new Date();
      const trialEnd = new Date(user.trial_end_date);
      
      if (now > trialEnd) {
        return res.status(403).json({ 
          message: 'Trial expirado. Faça upgrade para continuar.',
          trialExpired: true,
          current_plan: 'trial'
        });
      }
    }

    // Verificar se assinatura paga está ativa
    if (user.subscription_plan !== 'trial' && !user.subscription_active) {
      return res.status(403).json({ 
        message: 'Assinatura inativa. Por favor, atualize seu método de pagamento.',
        subscription_inactive: true,
        current_plan: user.subscription_plan
      });
    }

    next();
  } catch (error) {
    console.error('❌ Erro ao verificar assinatura:', error);
    res.status(500).json({ message: 'Erro ao verificar assinatura' });
  }
};
