# 🚀 Deploy no Render - Guia Completo

## ✅ Pré-requisitos

1. **MongoDB Atlas** configurado
2. **Conta no Render** (render.com)
3. **Repositório GitHub** atualizado

---

## 📋 Passo 1: Configurar MongoDB Atlas

### 1.1 Obter Connection String

1. Vai a [MongoDB Atlas](https://cloud.mongodb.com)
2. No teu cluster, clica **Connect**
3. Escolhe **Connect your application**
4. Copia a connection string:
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/myfitness
   ```
5. Substitui `<password>` pela tua password real
6. Substitui o nome da database se necessário

### 1.2 Whitelist de IPs

1. Em MongoDB Atlas > Network Access
2. Clica **Add IP Address**
3. Escolhe **Allow Access From Anywhere** (0.0.0.0/0)
4. Confirma

---

## 🎯 Passo 2: Deploy no Render

### 2.1 Criar Web Service

1. Vai a [Render Dashboard](https://dashboard.render.com)
2. Clica **New +** > **Web Service**
3. Conecta o repositório GitHub: `lou-spec/myfitness`
4. Configura:
   - **Name**: `myfitness-api`
   - **Region**: Frankfurt (ou mais próximo)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free

### 2.2 Adicionar Variáveis de Ambiente

No Render, em **Environment**, adiciona:

#### Obrigatórias:

```bash
# MongoDB (USA A TUA CONNECTION STRING DO ATLAS)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/myfitness?retryWrites=true&w=majority

# JWT Secret (gera um aleatório)
JWT_SECRET=seu_secret_super_seguro_aqui_min_32_caracteres

# Frontend URL (Vercel)
FRONTEND_URL=https://myfitness-neon.vercel.app

# Node Environment
NODE_ENV=production
```

#### Opcionais (Email):

```bash
EMAIL_USER=lentonobrega2016@gmail.com
EMAIL_PASS=vyvhposrsgemffcu
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

#### Stripe (quando configurares):

```bash
STRIPE_SECRET_KEY=sk_test_... (ou sk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...
```

### 2.3 Deploy

1. Clica **Create Web Service**
2. Aguarda o deploy (2-5 minutos)
3. URL da API: `https://myfitness-api.onrender.com`

---

## 🔧 Passo 3: Atualizar Frontend (Vercel)

### 3.1 Atualizar URL da API

No Vercel, adiciona variável de ambiente:

```bash
VITE_API_URL=https://myfitness-api.onrender.com
```

### 3.2 Atualizar Código do Frontend

Se o frontend usa hardcoded URL, atualiza em `src/` para:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 3.3 Redeploy

1. Vai ao Vercel Dashboard
2. Projeto `myfitness`
3. Clica **Redeploy**

---

## ✅ Passo 4: Testar

### 4.1 Testar API

```bash
# Testar rota raiz
curl https://myfitness-api.onrender.com

# Deve retornar:
# {"msg":"API Personal Trainer - MVP v1.0"}
```

### 4.2 Testar no Frontend

1. Vai a https://myfitness-neon.vercel.app
2. Tenta fazer login/registo
3. Verifica se conecta à API

---

## 🐛 Troubleshooting

### Erro: "MongoDB connection failed"

**Solução:**
1. Verifica se a connection string está correta
2. Confirma que o IP 0.0.0.0/0 está whitelisted no MongoDB Atlas
3. Verifica se a password não tem caracteres especiais (URL encode se necessário)

### Erro: "CORS blocked"

**Solução:**
1. Confirma que `FRONTEND_URL` está definida no Render
2. Verifica se o valor é exatamente: `https://myfitness-neon.vercel.app` (sem / no fim)

### Erro: "Build failed"

**Solução:**
1. Verifica se `package.json` está no diretório `backend/`
2. Confirma que o Root Directory está definido como `backend`

### API lenta na primeira request

**Normal no Free Plan do Render:**
- O serviço hiberna após 15 minutos de inatividade
- Primeira request demora 30-60 segundos a "acordar"
- Requests seguintes são rápidas

---

## 📊 Monitorização

### Ver Logs do Render:

1. Dashboard > `myfitness-api`
2. Tab **Logs**
3. Verifica se vês:
   ```
   ✅ MongoDB Atlas conectado
   🚀 Servidor a correr na porta 5000
   ```

### Ver Logs do Vercel:

1. Dashboard > `myfitness`
2. Tab **Functions**
3. Verifica requests

---

## 🔐 Segurança (Produção)

### Antes de ir para produção:

1. **MongoDB**: Restringir IPs (remover 0.0.0.0/0)
2. **JWT_SECRET**: Gerar secret forte (min 32 caracteres)
3. **Stripe**: Trocar de test keys para live keys
4. **HTTPS**: Confirmar que tudo usa HTTPS
5. **Rate Limiting**: Adicionar ao Express

---

## 📝 Checklist Final

- [ ] MongoDB Atlas com connection string copiada
- [ ] IP 0.0.0.0/0 whitelisted no MongoDB
- [ ] Render Web Service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy concluído com sucesso
- [ ] API responde em https://myfitness-api.onrender.com
- [ ] Frontend atualizado com nova URL da API
- [ ] Vercel redeploy feito
- [ ] Login/Registo funciona no frontend
- [ ] Logs do Render mostram conexão MongoDB OK

---

## 🆘 Suporte

**Logs do Render:**
```bash
# Vê logs em tempo real no dashboard
# OU via CLI:
render logs -s myfitness-api
```

**MongoDB Atlas:**
- Metrics > Ver conexões ativas
- Network Access > Ver IPs permitidos

**Vercel:**
- Realtime logs no dashboard
- Verifica variáveis de ambiente

---

✅ **Tudo pronto!** A tua API está agora live no Render conectada ao MongoDB Atlas e o frontend no Vercel.
