# 🔧 Configuração do Stripe - Guia Completo

## ⚠️ IMPORTANTE: O pagamento NÃO funciona sem esta configuração!

Este guia explica como configurar o Stripe para que os pagamentos funcionem na tua aplicação.

---

## 📋 Passo 1: Obter os Price IDs do Stripe

1. **Acede ao Dashboard do Stripe**: https://dashboard.stripe.com
2. **Vai para "Products"** (Produtos)
3. **Para cada produto (Básico, Pro, Premium)**:
   - Clica no produto
   - Copia o **Price ID** (começa com `price_...`)
   
   Exemplo:
   ```
   Plano Básico (€15/mês):  price_1QMabcdefghijklmn
   Plano Pro (€25/mês):     price_1QMabcdefghijklmn
   Plano Premium (€40/mês): price_1QMabcdefghijklmn
   ```

---

## 🔐 Passo 2: Obter as Secret Keys

### Secret Key (OBRIGATÓRIA)
1. No Dashboard do Stripe, vai para **Developers** → **API keys**
2. Copia a **Secret key** (começa com `sk_...`)
   - ⚠️ **NUNCA** partilhes esta chave!
   - ⚠️ Esta é a chave que permite fazer cobranças

### Webhook Secret (OBRIGATÓRIA para receber notificações)
1. No Dashboard do Stripe, vai para **Developers** → **Webhooks**
2. Clica em **"Add endpoint"**
3. Configura:
   - **Endpoint URL**: `https://myfitness-pkft.onrender.com/api/subscription/webhook`
   - **Events to listen**: Seleciona:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`
4. Clica em **"Add endpoint"**
5. **Copia o Signing secret** (começa com `whsec_...`)

---

## 🚀 Passo 3: Configurar no Render

1. **Acede ao Dashboard do Render**: https://dashboard.render.com
2. **Vai para o teu serviço backend** (myfitness-pkft)
3. Clica em **"Environment"** na barra lateral
4. **Adiciona as seguintes variáveis** (clica "Add Environment Variable"):

```bash
# Stripe Secret Key (OBRIGATÓRIA)
STRIPE_SECRET_KEY=sk_live_... (ou sk_test_... se estás em modo teste)

# Webhook Secret (OBRIGATÓRIA)
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs dos Planos (OBRIGATÓRIOS)
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Frontend URL (já deve estar configurada)
FRONTEND_URL=https://myfitness-neon.vercel.app
```

5. **Clica em "Save Changes"**
6. **Aguarda o redeploy automático** (demora ~2 minutos)

---

## ✅ Passo 4: Verificar se Está a Funcionar

### Teste Rápido:

1. **Abre os logs do Render**:
   - Dashboard Render → Teu serviço → "Logs"
   
2. **Faz login** no MyFitness (https://myfitness-neon.vercel.app)

3. **Clica num plano** (Básico, Pro ou Premium)

4. **Verifica os logs** no Render. Deves ver:
   ```
   🔵 Criar checkout session - Plan: pro User: 674a...
   🔵 Price IDs configurados:
     basic: Definido ✅
     pro: Definido ✅
     premium: Definido ✅
   ✅ Price ID selecionado: price_1QMabc...
   ```

5. Se vires **"❌ NÃO DEFINIDO"**, volta ao Passo 3 e verifica as variáveis.

---

## 🐛 Problemas Comuns

### Erro: "Plano inválido ou Price ID não configurado"
**Causa**: Variáveis de ambiente não configuradas no Render
**Solução**: Repete o Passo 3, certifica-te que os nomes estão EXATAMENTE como indicado

### Erro: "Invalid API Key"
**Causa**: STRIPE_SECRET_KEY incorreta ou não configurada
**Solução**: 
- Verifica que copiaste a chave completa do Stripe Dashboard
- Verifica que usaste `sk_live_...` (produção) ou `sk_test_...` (teste)

### Erro: "No signatures found matching"
**Causa**: STRIPE_WEBHOOK_SECRET incorreta
**Solução**: 
- Cria um novo webhook endpoint no Stripe
- Copia o novo signing secret
- Atualiza a variável no Render

### Pagamento funciona mas subscrição não ativa
**Causa**: Webhook não está a receber eventos
**Solução**:
- Verifica se o webhook URL está correto: `https://myfitness-pkft.onrender.com/api/subscription/webhook`
- Verifica os logs do Stripe Dashboard → Webhooks → [teu endpoint] → "Recent events"
- Se vires erros 4xx/5xx, verifica os logs do Render

---

## 📊 Como Testar Pagamentos (Modo Teste)

Se estás a usar o modo **test** do Stripe:

### Cartões de Teste:
```
✅ Sucesso: 4242 4242 4242 4242
❌ Falha:   4000 0000 0000 0002
⏱️ Requer autenticação: 4000 0025 0000 3155

Data de validade: Qualquer data futura
CVC: Qualquer 3 dígitos
```

### Verificar Webhook em Teste:
1. Dashboard Stripe → Webhooks → [teu endpoint]
2. Clica em "Send test event"
3. Seleciona `checkout.session.completed`
4. Clica "Send test webhook"
5. Verifica os logs do Render

---

## 🎯 Checklist Final

Antes de dares por completo, verifica:

- [ ] ✅ STRIPE_SECRET_KEY configurada no Render
- [ ] ✅ STRIPE_WEBHOOK_SECRET configurada no Render
- [ ] ✅ STRIPE_BASIC_PRICE_ID configurada no Render
- [ ] ✅ STRIPE_PRO_PRICE_ID configurada no Render
- [ ] ✅ STRIPE_PREMIUM_PRICE_ID configurada no Render
- [ ] ✅ Webhook criado no Stripe Dashboard
- [ ] ✅ Webhook URL correta: https://myfitness-pkft.onrender.com/api/subscription/webhook
- [ ] ✅ Eventos selecionados no webhook
- [ ] ✅ Teste de pagamento funciona
- [ ] ✅ Webhook recebe evento e ativa subscrição
- [ ] ✅ Logs do Render mostram "✅ Price ID selecionado"

---

## 🆘 Preciso de Ajuda?

1. **Verifica os logs do Render** primeiro
2. **Verifica os logs do Stripe Webhook** (Dashboard → Webhooks)
3. **Abre o console do browser** (F12) e procura erros
4. Se ainda tiveres problemas, partilha:
   - Screenshot dos logs do Render
   - Screenshot das variáveis de ambiente (SEM mostrar as chaves completas!)
   - Mensagem de erro exata

---

## 📈 Migrar de Teste para Produção

Quando estiveres pronto para aceitar pagamentos reais:

1. **Ativa a tua conta Stripe** (completa verificação)
2. **Obtém as chaves LIVE**:
   - Secret Key: `sk_live_...` (não `sk_test_...`)
   - Webhook Secret: Cria novo webhook no modo LIVE
3. **Atualiza as variáveis no Render** com as chaves LIVE
4. **Teste com cartão REAL** (valor pequeno tipo €1)
5. **Reembolsa o teste** no Dashboard Stripe

---

✅ **Boa sorte com os pagamentos!** 🚀
