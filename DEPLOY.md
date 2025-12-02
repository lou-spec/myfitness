# 🚀 Guia de Deploy Rápido

## 1. Deploy Backend (Railway / Render)

### Railway (Recomendado)

1. Vai a [railway.app](https://railway.app)
2. Conecta o GitHub
3. Cria novo projeto → Deploy from GitHub
4. Seleciona a pasta `backend`
5. Adiciona variáveis de ambiente:
   ```
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   JWT_SECRET=seu_secret_super_seguro_aqui
   PORT=5000
   ```
6. Deploy automático!

### Render

1. Vai a [render.com](https://render.com)
2. New → Web Service
3. Conecta GitHub
4. Configurações:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
5. Adiciona variáveis de ambiente
6. Deploy!

## 2. MongoDB Atlas (Cloud Database)

1. Vai a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Cria cluster gratuito
3. Cria database user
4. Whitelist IP: 0.0.0.0/0 (permitir todos)
5. Copia connection string
6. Substitui `<password>` pela tua password
7. Usa em `MONGO_URL`

## 3. Deploy Frontend (Vercel)

### Vercel (Mais Fácil)

1. Vai a [vercel.com](https://vercel.com)
2. Import Git Repository
3. Seleciona a pasta `frontend`
4. Framework: Vite
5. Environment Variables:
   ```
   VITE_API_URL=https://teu-backend.railway.app
   ```
6. Deploy!

### Netlify

1. Vai a [netlify.com](https://www.netlify.com)
2. Drag & drop a pasta `frontend/dist`
3. Ou conecta GitHub para deploy automático

## 4. Configurar CORS

No `backend/index.js`, atualiza:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://teu-dominio.vercel.app'
  ]
}));
```

## 5. Atualizar URLs no Frontend

Cria `frontend/.env`:

```env
VITE_API_URL=https://teu-backend.railway.app
```

E nos componentes, usa:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/auth/login`, ...);
```

## 6. Custom Domain (Opcional)

### Para Backend (Railway/Render)
1. Vai a Settings → Custom Domain
2. Adiciona teu domínio (ex: api.meusite.com)
3. Configura DNS records

### Para Frontend (Vercel)
1. Vai a Settings → Domains
2. Adiciona domínio (ex: meusite.com)
3. Configura DNS (CNAME ou A record)

## 7. SSL/HTTPS

✅ Railway, Render, Vercel incluem SSL automático!

## 8. Monitoramento

### Backend
- Railway: Vê logs em tempo real
- Render: Dashboard com métricas

### Frontend
- Vercel: Analytics incluído
- Google Analytics (opcional)

## 9. CI/CD Automático

Push para GitHub → Deploy automático! 🎉

## 10. Checklist Pré-Deploy

- [ ] `.env` configurado com secrets seguros
- [ ] CORS configurado corretamente
- [ ] MongoDB Atlas criado
- [ ] URLs atualizados no frontend
- [ ] Testes básicos funcionando
- [ ] README atualizado

## 🔥 Deploy Rápido (30 minutos)

1. **5min** - MongoDB Atlas
2. **10min** - Backend no Railway
3. **10min** - Frontend no Vercel
4. **5min** - Testes finais

## 💡 Dicas

- Usa `.env.example` para documentar variáveis
- Nunca commita secrets no Git
- Testa em staging antes de produção
- Usa branches: `main` (prod) e `dev` (staging)

## 🆘 Troubleshooting

**Erro CORS:**
```javascript
app.use(cors({ origin: '*' })); // Temporário para debug
```

**Backend não conecta MongoDB:**
- Verifica whitelist IP no Atlas
- Testa connection string localmente

**Frontend não encontra API:**
- Verifica variável `VITE_API_URL`
- Abre DevTools → Network tab

---

**Boa sorte! 🚀**
