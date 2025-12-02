import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Criar sessão de checkout
router.post('/create-checkout-session', auth, subscriptionController.createCheckoutSession);

// Webhook do Stripe (NÃO protegido, validado por assinatura)
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.stripeWebhook);

// Obter info da assinatura
router.get('/info', auth, subscriptionController.getSubscriptionInfo);

// Cancelar assinatura
router.post('/cancel', auth, subscriptionController.cancelSubscription);

// Portal do cliente
router.post('/create-portal-session', auth, subscriptionController.createPortalSession);

export default router;
