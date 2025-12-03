import Stripe from 'stripe';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Criar sessão de checkout do Stripe
export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body; // 'basic', 'pro', ou 'premium'
    const userId = req.user.id;

    console.log('🔵 Criar checkout session - Plan:', plan, 'User:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Utilizador não encontrado:', userId);
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    // Mapear planos para price IDs do Stripe
    const priceIds = {
      basic: process.env.STRIPE_BASIC_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID
    };

    console.log('🔵 Price IDs configurados:', {
      basic: priceIds.basic ? 'Definido' : '❌ NÃO DEFINIDO',
      pro: priceIds.pro ? 'Definido' : '❌ NÃO DEFINIDO',
      premium: priceIds.premium ? 'Definido' : '❌ NÃO DEFINIDO'
    });

    const priceId = priceIds[plan];
    if (!priceId) {
      console.log('❌ Price ID não encontrado para o plano:', plan);
      return res.status(400).json({ 
        message: `Plano inválido ou Price ID não configurado para: ${plan}`,
        debug: `Verifique a variável de ambiente STRIPE_${plan.toUpperCase()}_PRICE_ID no Render`
      });
    }

    console.log('✅ Price ID selecionado:', priceId);

    // Verificar se Stripe Secret Key está configurada
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY não configurada!');
      return res.status(500).json({ 
        message: 'Erro de configuração do servidor',
        debug: 'STRIPE_SECRET_KEY não está definida nas variáveis de ambiente'
      });
    }

    console.log('🔵 Criando sessão de checkout no Stripe...');
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

    console.log('✅ Sessão criada com sucesso! URL:', session.url);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Erro ao criar checkout:', error);
    console.error('❌ Detalhes do erro:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      message: 'Erro ao criar sessão de pagamento',
      debug: error.message,
      hint: 'Verifica os logs do Render para mais detalhes'
    });
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

    console.log(`✅ Subscription activated for user ${user.email} - Plan: ${plan}`);
  } catch (error) {
    console.error('❌ Error handling checkout complete:', error);
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
    console.log(`✅ Subscription updated for user ${user.email}`);
  } catch (error) {
    console.error('❌ Error handling subscription update:', error);
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
    console.log(`✅ Subscription canceled for user ${user.email}`);
  } catch (error) {
    console.error('❌ Error handling subscription cancel:', error);
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
    console.log(`❌ Payment failed for user ${user.email}`);
  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
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
