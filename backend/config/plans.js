// Configuração dos planos de assinatura
export const PLANS = {
  trial: {
    name: 'Trial',
    price: 0,
    duration_days: 14,
    features: {
      max_clients: 5,
      unlimited_appointments: true,
      dashboard: true,
      basic_notifications: true,
      packages: true,
      public_profile: true,
      advanced_packages: false,
      detailed_stats: false,
      advanced_notifications: false,
      feedback_system: false,
      public_store: false,
      video_upload: false,
      integrated_chat: false,
      priority_support: false,
      auto_promotions: false,
      custom_branding: false,
      visual_customization: false
    }
  },
  basic: {
    name: 'Básico',
    price: 15, // €15/mês
    stripe_price_id: process.env.STRIPE_BASIC_PRICE_ID,
    features: {
      max_clients: 10,
      unlimited_appointments: true,
      dashboard: true,
      basic_notifications: true,
      packages: false,
      public_profile: true,
      advanced_packages: false,
      detailed_stats: false,
      advanced_notifications: false,
      feedback_system: false,
      public_store: false,
      payment_management: false,
      video_upload: false,
      integrated_chat: false,
      priority_support: false,
      auto_promotions: false,
      custom_branding: false,
      visual_customization: false
    }
  },
  pro: {
    name: 'Pro',
    price: 25, // €25/mês
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      max_clients: 30,
      unlimited_appointments: true,
      dashboard: true,
      basic_notifications: true,
      packages: true,
      public_profile: true,
      advanced_packages: true,
      detailed_stats: true,
      advanced_notifications: true,
      feedback_system: true,
      public_store: true,
      payment_management: true,
      video_upload: false,
      integrated_chat: false,
      priority_support: true,
      auto_promotions: false,
      custom_branding: false,
      visual_customization: false
    }
  },
  premium: {
    name: 'Premium',
    price: 40, // €40/mês
    stripe_price_id: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: {
      max_clients: -1, // unlimited
      unlimited_appointments: true,
      dashboard: true,
      basic_notifications: true,
      packages: true,
      public_profile: true,
      advanced_packages: true,
      detailed_stats: true,
      advanced_notifications: true,
      feedback_system: true,
      public_store: true,
      payment_management: true,
      video_upload: true,
      integrated_chat: true,
      priority_support: true,
      auto_promotions: true,
      custom_branding: true,
      visual_customization: true,
      advanced_analytics: true
    }
  }
};

// Função para verificar se usuário pode adicionar mais clientes
export const canAddClient = (user, currentClientCount) => {
  const plan = PLANS[user.subscription_plan] || PLANS.trial;
  if (plan.features.max_clients === -1) return true; // unlimited
  return currentClientCount < plan.features.max_clients;
};

// Função para verificar se usuário tem acesso a uma feature
export const hasFeature = (user, featureName) => {
  const plan = PLANS[user.subscription_plan] || PLANS.trial;
  return plan.features[featureName] === true;
};

// Função para obter limites do plano
export const getPlanLimits = (planName) => {
  return PLANS[planName] || PLANS.trial;
};
