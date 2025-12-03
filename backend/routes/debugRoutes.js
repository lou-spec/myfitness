import express from 'express';

const router = express.Router();

// Rota de debug (remover em produção!)
router.get('/check-env', (req, res) => {
  const envStatus = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '✅ Definida' : '❌ NÃO DEFINIDA',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? '✅ Definida' : '❌ NÃO DEFINIDA',
    STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID ? '✅ Definida' : '❌ NÃO DEFINIDA',
    STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID ? '✅ Definida' : '❌ NÃO DEFINIDA',
    STRIPE_PREMIUM_PRICE_ID: process.env.STRIPE_PREMIUM_PRICE_ID ? '✅ Definida' : '❌ NÃO DEFINIDA',
    FRONTEND_URL: process.env.FRONTEND_URL || '❌ NÃO DEFINIDA',
    MONGO_URI: process.env.MONGO_URI ? '✅ Definida' : '❌ NÃO DEFINIDA',
  };

  res.json({
    message: 'Status das variáveis de ambiente',
    environment: envStatus,
    timestamp: new Date().toISOString()
  });
});

export default router;
