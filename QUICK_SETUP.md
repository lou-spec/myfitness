# ⚡ Setup Rápido - Render + Vercel

## 🎯 O Que Mudou

✅ **Backend configurado para Render + MongoDB Atlas**
✅ **CORS configurado para https://myfitness-neon.vercel.app**
✅ **Suporte para MONGO_URL e MONGODB_URI**
✅ **Port dinâmico (0.0.0.0) para Render**

---

## 🚀 Deploy Render (5 minutos)

### 1. Criar Web Service
1. Vai a https://dashboard.render.com
2. **New +** > **Web Service**
3. Conecta: `lou-spec/myfitness`
4. Configuração:
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `node index.js`

### 2. Variáveis de Ambiente (Environment)

```bash
MONGO_URL=mongodb+srv://teu_user:tua_pass@cluster.mongodb.net/myfitness
FRONTEND_URL=https://myfitness-neon.vercel.app
JWT_SECRET=gera_um_secret_seguro_aqui
NODE_ENV=production
```

**Opcional (Email):**
```bash
EMAIL_USER=lentonobrega2016@gmail.com
EMAIL_PASS=vyvhposrsgemffcu
```

### 3. Deploy
- Clica **Create Web Service**
- Aguarda 2-3 minutos
- Copia a URL: `https://myfitness-api.onrender.com`

---

## 🌐 Atualizar Vercel

### Opção A: Variável de Ambiente (Recomendado)

1. Vercel Dashboard > `myfitness`
2. Settings > Environment Variables
3. Adiciona:
   ```
   VITE_API_URL=https://myfitness-api.onrender.com
   ```
4. Redeploy

### Opção B: Hardcoded

Atualiza todos os `axios` calls no frontend:

```javascript
// Antes
const API_URL = 'http://localhost:5000';

// Depois
const API_URL = 'https://myfitness-api.onrender.com';
```

---

## ✅ Testar

```bash
# Testar API
curl https://myfitness-api.onrender.com
# Deve retornar: {"msg":"API Personal Trainer - MVP v1.0"}

# Testar Login no Frontend
# Vai a: https://myfitness-neon.vercel.app
```

---

## 🐛 Se Algo Falhar

### MongoDB não conecta:
1. MongoDB Atlas > Network Access
2. Add IP: `0.0.0.0/0` (Allow all)

### CORS Error:
1. Verifica `FRONTEND_URL` no Render
2. Valor: `https://myfitness-neon.vercel.app` (sem / no fim)

### API lenta:
- Normal no Free Plan do Render
- Primeira request demora ~30-60s (servidor hiberna)

---

## 📊 Ver Logs

**Render:**
- Dashboard > Logs (tempo real)

**MongoDB Atlas:**
- Metrics > Database Access

**Vercel:**
- Deployment > Function Logs

---

✅ **Está tudo configurado!** Só precisas fazer o deploy no Render com as variáveis corretas.
