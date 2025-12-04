import User from "../models/User.js";

// Middleware para verificar se o trainer do cliente está ativo
export const checkClientTrainerActive = async (req, res, next) => {
  try {
    // Apenas aplicar a clientes
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Utilizador não encontrado" });
    }

    // Se for trainer, passa
    if (user.role === "trainer") {
      return next();
    }

    // Se for cliente, verifica se tem trainer associado
    if (user.role === "client") {
      if (!user.trainer_id) {
        return res.status(403).json({ 
          message: "Ainda não tens um personal trainer associado",
          noTrainer: true 
        });
      }

      // Verificar se o trainer está com subscrição ativa
      const trainer = await User.findById(user.trainer_id);
      
      if (!trainer) {
        return res.status(403).json({ 
          message: "O teu personal trainer não foi encontrado",
          trainerNotFound: true 
        });
      }

      // Verificar se o trainer tem subscrição ativa
      if (!trainer.subscription_active) {
        return res.status(403).json({ 
          message: "O teu personal trainer não tem uma subscrição ativa no momento",
          trainerInactive: true,
          trainerName: trainer.name
        });
      }

      // Verificar se trial do trainer expirou
      if (trainer.subscription_plan === "trial" && trainer.trial_end_date) {
        const now = new Date();
        if (now > trainer.trial_end_date) {
          return res.status(403).json({ 
            message: "O período experimental do teu personal trainer expirou",
            trainerTrialExpired: true,
            trainerName: trainer.name
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error("❌ Erro ao verificar trainer do cliente:", error);
    res.status(500).json({ message: "Erro ao verificar permissões" });
  }
};
