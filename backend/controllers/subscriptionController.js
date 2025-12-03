import Stripe from 'stripe';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Criar sessão de checkout do Stripe
export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });

    const priceIds = {
      basic: process.env.STRIPE_BASIC_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      return res.status(400).json({ 
        message: `Price ID não configurado: STRIPE_${plan.toUpperCase()}_PRICE_ID`
      });
    }
    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      client_reference_id: userId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/trial-expired`,
      metadata: {
        userId: userId,
        plan: plan
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Erro checkout:', error.message);
    res.status(500).json({ message: 'Erro ao criar pagamento' });
  }
};

// Webhook do Stripe para processar eventos
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Processar diferentes tipos de eventos
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionCancel(event.data.object);
      break;
    
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Processar checkout completo
async function handleCheckoutComplete(session) {
  try {
    const userId = session.client_reference_id || session.metadata.userId;
    const plan = session.metadata.plan;

    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return;
    }

    // Atualizar usuário com nova assinatura
    user.subscription_plan = plan;
    user.subscription_active = true;
    user.subscription_stripe_id = session.subscription;
    user.subscription_customer_id = session.customer;
    user.trial_end_date = null; // Limpar trial

    await user.save();

    // Subscription activated
  } catch (error) {
    console.error('❌ Erro checkout complete:', error.message);
  }
}

// Processar atualização de assinatura
async function handleSubscriptionUpdate(subscription) {
  try {
    const user = await User.findOne({ subscription_stripe_id: subscription.id });
    if (!user) return;

    // Verificar se assinatura foi cancelada ou pausada
    if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
      user.subscription_active = false;
    } else if (subscription.status === 'active') {
      user.subscription_active = true;
    }

    await user.save();
    // Subscription updated
  } catch (error) {
    console.error('❌ Erro subscription update:', error.message);
  }
}

// Processar cancelamento de assinatura
async function handleSubscriptionCancel(subscription) {
  try {
    const user = await User.findOne({ subscription_stripe_id: subscription.id });
    if (!user) return;

    user.subscription_active = false;
    user.subscription_plan = 'trial';
    
    await user.save();
    // Subscription canceled
  } catch (error) {
    console.error('❌ Erro subscription cancel:', error.message);
  }
}

// Processar falha de pagamento
async function handlePaymentFailed(invoice) {
  try {
    const user = await User.findOne({ subscription_customer_id: invoice.customer });
    if (!user) return;

    user.subscription_active = false;
    await user.save();

    // TODO: Enviar email notificando sobre falha no pagamento
    // Payment failed logged
  } catch (error) {
    console.error('❌ Erro payment failed:', error.message);
  }
}

// Obter informações da assinatura atual
export const getSubscriptionInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    let subscriptionData = {
      plan: user.subscription_plan,
      active: user.subscription_active,
      trial_end_date: user.trial_end_date
    };

    // Se tiver assinatura Stripe, buscar detalhes
    if (user.subscription_stripe_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.subscription_stripe_id);
        subscriptionData.current_period_end = new Date(subscription.current_period_end * 1000);
        subscriptionData.cancel_at_period_end = subscription.cancel_at_period_end;
        subscriptionData.status = subscription.status;
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    res.json(subscriptionData);
  } catch (error) {
    console.error('❌ Erro ao buscar info da assinatura:', error);
    res.status(500).json({ message: 'Erro ao buscar informações' });
  }
};

// Cancelar assinatura
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.subscription_stripe_id) {
      return res.status(404).json({ message: 'Assinatura não encontrada' });
    }

    // Cancelar no Stripe (no final do período)
    await stripe.subscriptions.update(user.subscription_stripe_id, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Assinatura será cancelada no final do período' });
  } catch (error) {
    console.error('❌ Erro ao cancelar assinatura:', error);
    res.status(500).json({ message: 'Erro ao cancelar assinatura' });
  }
};

// Portal do cliente Stripe (para gerenciar pagamento)
export const createPortalSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.subscription_customer_id) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('❌ Erro ao criar portal:', error);
    res.status(500).json({ message: 'Erro ao criar portal' });
  }
};
