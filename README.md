# 🏋️ Personal Trainer SaaS - MVP

Plataforma SaaS completa para Personal Trainers gerirem clientes, agendamentos e disponibilidade.

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação
- ✅ Registo de Personal Trainers
- ✅ Login com JWT
- ✅ Proteção de rotas

### 👥 Gestão de Clientes
- ✅ Criar novos clientes
- ✅ Listar todos os clientes
- ✅ Ver detalhes (email, telefone, notas médicas)
- ✅ Histórico de sessões

### 📅 Sistema de Agendamentos
- ✅ Criar agendamentos
- ✅ Visualizar próximas sessões
- ✅ Status (agendado, cancelado, concluído, falta)
- ✅ Evitar conflitos de horário (duplo-booking)

### ⏰ Disponibilidade
- ✅ Definir horários disponíveis por dia da semana
- ✅ Horários recorrentes
- ✅ Verificação de conflitos

### 📊 Dashboard
- ✅ Visão geral com estatísticas
- ✅ Total de clientes
- ✅ Sessões do mês
- ✅ Próximas sessões
- ✅ Tabs para navegação

## 🎨 Design Premium

- ✅ **Glassmorphism** - Efeito de vidro fosco
- ✅ **Gradientes animados** - Background dinâmico
- ✅ **Animações suaves** - Transições fluidas
- ✅ **Neon effects** - Brilhos e glows
- ✅ **Responsivo** - Mobile-first design
- ✅ **Dark theme** - Visual moderno

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** + **Express**
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **bcryptjs** para hashing de passwords

### Frontend
- **React** (Vite)
- **CSS3** moderno (sem frameworks)
- **Fetch API** para requests

## 🚀 Como Executar

### 1. Pré-requisitos
- Node.js (v16+)
- MongoDB instalado e a correr

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

O servidor irá correr em `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend irá correr em `http://localhost:5173`

### 4. MongoDB

Certifica-te que o MongoDB está a correr:

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

## 📝 Variáveis de Ambiente

O ficheiro `.env` no backend já está configurado:

```env
MONGO_URL=mongodb://127.0.0.1:27017/myfitness
JWT_SECRET=123456789
PORT=5000
```

## 🔥 Endpoints API

### Autenticação
- `POST /api/auth/register` - Registar trainer
- `POST /api/auth/login` - Login

### Clientes
- `GET /api/clients` - Listar clientes (auth)
- `POST /api/clients` - Criar cliente (auth)
- `GET /api/clients/:id` - Ver cliente (auth)
- `PUT /api/clients/:id` - Atualizar cliente (auth)
- `DELETE /api/clients/:id` - Remover cliente (auth)

### Disponibilidade
- `GET /api/availability?trainer_id=xxx` - Ver disponibilidade (público)
- `POST /api/availability` - Criar disponibilidade (auth)
- `DELETE /api/availability/:id` - Remover disponibilidade (auth)

### Agendamentos
- `GET /api/appointments` - Listar agendamentos (auth)
- `POST /api/appointments` - Criar agendamento (público/auth)
- `PATCH /api/appointments/:id` - Atualizar status (auth)
- `GET /api/appointments/stats/dashboard` - Estatísticas (auth)

## 📊 Modelos de Dados

### User (Trainer)
```javascript
{
  name, email, password, photo_url, city, 
  specialties[], bio, price_per_session, 
  currency, slug
}
```

### Client
```javascript
{
  trainer_id, name, email, phone, 
  notes, medical_info
}
```

### AvailabilitySlot
```javascript
{
  trainer_id, weekday (0-6), 
  start_time, end_time, recurring
}
```

### Appointment
```javascript
{
  trainer_id, client_id, client_name, 
  client_email, client_phone,
  start_datetime, end_datetime,
  status, payment_status, payment_id, notes
}
```

### Payment
```javascript
{
  appointment_id, trainer_id, amount, 
  currency, stripe_charge_id, status
}
```

### Package
```javascript
{
  trainer_id, title, sessions_count, 
  price, description, active
}
```

## 🎯 Próximas Funcionalidades (Roadmap)

- [ ] Integração Stripe para pagamentos
- [ ] Lembretes automáticos por email/SMS
- [ ] Calendário público para reservas
- [ ] Sistema de pacotes de sessões
- [ ] Planos de treino
- [ ] Gráficos e relatórios
- [ ] Exportar dados (CSV)
- [ ] Integração Google Calendar
- [ ] Upload de fotos
- [ ] Mensagens diretas trainer-cliente
- [ ] Marketplace de trainers

## 🐛 Debug

Se tiveres problemas:

1. **MongoDB não conecta:**
   - Verifica se está a correr: `mongosh`
   - Verifica o URL em `.env`

2. **Erros no backend:**
   - Verifica logs no terminal
   - Confirma que todas as dependências estão instaladas

3. **Frontend não carrega:**
   - Verifica se backend está a correr
   - Abre DevTools e vê console

## 📦 Estrutura do Projeto

```
projeto/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── AvailabilitySlot.js
│   │   ├── Appointment.js
│   │   ├── Payment.js
│   │   └── Package.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── availabilityRoutes.js
│   │   └── appointmentRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── index.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ClientForm.jsx
    │   │   └── AvailabilityForm.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

## 💡 Dicas

1. **Primeiro login:** Cria uma conta no registo
2. **Adiciona clientes:** Usa o botão "Novo Cliente"
3. **Define disponibilidade:** Clica em "Definir Disponibilidade"
4. **Navega pelas tabs:** Visão Geral, Clientes, Agendamentos

## 🎨 Customização

Para mudar as cores principais, edita as variáveis CSS em `index.css`:

```css
:root {
  --primary: #00ffaa;
  --secondary: #4579f5;
  --accent: #00d9ff;
}
```

## 📄 Licença

MIT - Usa à vontade!

---

**Desenvolvido com 💪 para Personal Trainers**
