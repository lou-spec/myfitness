# 🔧 Configuração do Stripe - Sistema de Subscrições

Este documento explica como configurar o sistema de pagamentos Stripe no backend.

## 📋 Planos Disponíveis

### Trial (Grátis - 14 dias)
- ✅ 5 clientes máximo
- ✅ Agendamentos ilimitados
- ✅ Funcionalidades básicas

### Basic (€15/mês)
- ✅ 20 clientes
- ✅ Agendamentos ilimitados
- ✅ Gestão de clientes
- ✅ Sistema de pagamentos

### Pro (€30/mês)
- ✅ Clientes ilimitados
- ✅ Todas as features do Basic
- ✅ Estatísticas avançadas
- ✅ Relatórios detalhados

### Premium (€50/mês)
- ✅ Todas as features do Pro
- ✅ Upload de vídeos
- ✅ Chat em tempo real
- ✅ Personalização de marca
- ✅ Suporte prioritário

## 🚀 Passo 1: Criar Conta Stripe

1. Acede a [https://stripe.com](https://stripe.com)
2. Cria uma conta ou faz login
3. Ativa o **modo de teste** para desenvolvimento

## 🔑 Passo 2: Obter API Keys

1. No dashboard Stripe, vai a **Developers > API Keys**
2. Copia a **Secret Key** (começa com `sk_test_...`)
3. Adiciona ao ficheiro `.env`:

```env
STRIPE_SECRET_KEY=sk_test_seu_token_aqui
```

## 💳 Passo 3: Criar Produtos e Preços

### Via Dashboard Stripe (Recomendado):

1. Vai a **Products > Add Product**
2. Cria 3 produtos:

#### Produto 1: Basic
- Nome: `Plano Basic`
- Descrição: `20 clientes, funcionalidades essenciais`
- Preço: `15 EUR`
- Tipo: **Recurring** (Mensal)
- Copia o **Price ID** (começa com `price_...`)

#### Produto 2: Pro
- Nome: `Plano Pro`
- Descrição: `Clientes ilimitados, estatísticas avançadas`
- Preço: `30 EUR`
- Tipo: **Recurring** (Mensal)
- Copia o **Price ID**

#### Produto 3: Premium
- Nome: `Plano Premium`
- Descrição: `Todas as funcionalidades, vídeos, chat`
- Preço: `50 EUR`
- Tipo: **Recurring** (Mensal)
- Copia o **Price ID**

### Adicionar ao .env:

```env
STRIPE_BASIC_PRICE_ID=price_1ABC123...
STRIPE_PRO_PRICE_ID=price_1DEF456...
STRIPE_PREMIUM_PRICE_ID=price_1GHI789...
```

## 🔔 Passo 4: Configurar Webhook

Os webhooks permitem que o Stripe notifique o backend quando pagamentos são concluídos.

### Para Desenvolvimento Local (Stripe CLI):

1. Instala o Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Faz login: `stripe login`
3. Inicia o webhook forwarding:
   ```bash
   stripe listen --forward-to http://localhost:5000/api/subscription/webhook
   ```
4. Copia o **webhook signing secret** (começa com `whsec_...`)
5. Adiciona ao `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui
   ```

### Para Produção (Servidor Real):

1. No dashboard Stripe, vai a **Developers > Webhooks**
2. Clica em **Add Endpoint**
3. URL: `https://seu-dominio.com/api/subscription/webhook`
4. Eventos a escutar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copia o **Signing Secret** e adiciona ao `.env`

## 📁 Passo 5: Verificar Ficheiro .env

O teu ficheiro `.env` deve ter estas variáveis:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Outras variáveis existentes
MONGO_URI=...
JWT_SECRET=...
PORT=5000
```

## 🧪 Passo 6: Testar Pagamentos

### Cartões de Teste Stripe:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Use qualquer data futura para validade e qualquer CVC.

## 🔄 Fluxo de Pagamento

### 1. Trainer clica em "Fazer Upgrade"
```javascript
// Frontend chama:
POST /api/subscription/create-checkout-session
Body: { plan: "basic" }
```

### 2. Backend cria sessão Stripe
- Retorna `session.url` para redirecionar

### 3. User completa pagamento no Stripe Checkout

### 4. Stripe envia webhook
- Evento: `checkout.session.completed`
- Backend atualiza user:
  - `subscription_plan`: "basic"
  - `subscription_active`: true
  - `subscription_stripe_id`: sub_xxx
  - `subscription_customer_id`: cus_xxx

### 5. User é redirecionado para `/dashboard`
- Agora tem acesso às funcionalidades do plano pago

## 🛡️ Middleware de Proteção

### checkClientLimit
Aplicado nas rotas:
- `POST /api/clients` - Criar novo cliente
- `POST /api/clients/associate-user` - Associar user como cliente

Verifica se o trainer atingiu o limite de clientes do plano atual.

### checkTrainerClientLimit
Aplicado na rota:
- `POST /api/auth/associate-trainer` - Cliente associa-se a trainer

Verifica se o TRAINER atingiu o limite antes de permitir associação.

### checkFeature
Para funcionalidades específicas (a implementar no frontend):
```javascript
router.post("/videos/upload", auth, checkFeature("video_upload"), ...);
router.get("/stats/advanced", auth, checkFeature("advanced_stats"), ...);
```

## 📊 Estrutura de Dados

### User Model - Campos Stripe:
```javascript
{
  subscription_plan: "basic" | "pro" | "premium" | "trial",
  subscription_active: true,
  subscription_stripe_id: "sub_1ABC...",
  subscription_customer_id: "cus_1DEF...",
  subscription_current_period_end: Date,
  subscription_cancel_at_period_end: false,
  trial_start_date: Date,
  trial_end_date: Date
}
```

## 🔍 Endpoints API

### GET /api/subscription/info
Retorna informações da subscrição atual do user.

**Response:**
```json
{
  "plan": "basic",
  "active": true,
  "limits": {
    "max_clients": 20,
    "current_clients": 5
  },
  "features": {
    "unlimited_appointments": true,
    "advanced_stats": false,
    "video_upload": false
  }
}
```

### POST /api/subscription/create-checkout-session
Cria sessão de pagamento Stripe.

**Request:**
```json
{
  "plan": "basic"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/..."
}
```

### POST /api/subscription/cancel
Cancela subscrição (mantém ativa até fim do período pago).

**Response:**
```json
{
  "message": "Subscrição cancelada. Ativa até 2024-12-31"
}
```

### POST /api/subscription/create-portal-session
Cria sessão do Stripe Customer Portal (para gerir métodos de pagamento).

**Response:**
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

## ⚠️ Notas Importantes

1. **Nunca commites** as chaves do Stripe ao Git
2. Use variáveis de ambiente diferentes para teste/produção
3. O webhook endpoint **não usa** autenticação JWT (Stripe assina as requests)
4. Em produção, use HTTPS para o webhook endpoint
5. Teste todos os cenários:
   - Pagamento bem-sucedido
   - Pagamento falhado
   - Cancelamento
   - Upgrade/Downgrade

## 🐛 Debug

### Ver logs do Stripe CLI:
```bash
stripe listen --forward-to http://localhost:5000/api/subscription/webhook
```

### Ver eventos no Dashboard:
**Developers > Events** - Lista todos os eventos Stripe

### Testar webhook manualmente:
```bash
stripe trigger checkout.session.completed
```

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

✅ **Próximo Passo**: Implementar frontend com componentes de pagamento
