# 📋 RELATÓRIO COMPLETO - PLATAFORMA MYFITNESS

## 🎯 VISÃO GERAL

**MyFitness** é uma plataforma web SaaS (Software as a Service) desenvolvida para gestão completa de personal trainers e seus clientes. O sistema permite que profissionais de fitness gerenciem o seu negócio de forma digital, automatizada e profissional, enquanto os clientes têm acesso a uma experiência personalizada de treino e acompanhamento.

### **Novidades da Última Atualização** (Dezembro 2025)

#### **🎨 Redesign Completo - Tema Fitness Único**
- ✅ **Design totalmente novo** criado especificamente para personal trainers
- ✅ Tema **vermelho/preto/branco** consistente em toda aplicação
- ✅ **Bordas angulares** (2px) e barra lateral vermelha característica
- ✅ **Tipografia forte** com uppercase e alto contraste
- ✅ **Texto alinhado à esquerda** em todos os componentes
- ✅ Interações dinâmicas (setas animadas, inputs que deslizam, sweep effects)
- ✅ **Background com grid pattern** simulando tatame de academia
- ✅ **Landing page redesenhada** - 100% vermelho/branco/preto
- ✅ Removidas **todas** as cores verdes e azuis antigas
- ✅ **Country selector corrigido** - texto agora visível em fundo claro
- ✅ **User info corrigida** - números de telefone visíveis (#666 em vez de vermelho)

#### **🚀 Funcionalidades Anteriores**
- ✅ Landing page profissional com 3 planos de preços
- ✅ Sistema de trial de 14 dias para trainers
- ✅ Auto-logout quando trial expira
- ✅ Emails automáticos de aviso (dia 13) e expiração (dia 14)
- ✅ Modal de cancelamento com motivo obrigatório
- ✅ Notificação por email ao trainer quando cliente cancela
- ✅ Visualização de perfil de clientes associados
- ✅ Debugging completo do sistema de emails

---

## 🏗️ ARQUITETURA TÉCNICA

### **Stack Tecnológico**

#### Backend
- **Node.js** v16+ com Express.js
- **MongoDB** - Base de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT (JSON Web Tokens)** - Autenticação e autorização
- **bcryptjs** - Encriptação de passwords
- **Nodemailer** - Sistema de emails automáticos
- **node-cron** - Agendamento de tarefas (lembretes)
- **dotenv** - Gestão de variáveis de ambiente

#### Frontend
- **React** v19.2.0 (Vite)
- **JavaScript ES6+**
- **CSS3 puro** com design glassmorphism
- **Fetch API** para comunicação REST
- **LocalStorage** para gestão de tokens

#### Infraestrutura
- **REST API** - Comunicação cliente-servidor
- **SMTP Gmail** - Envio de emails
- **Porta Backend**: 5000
- **Porta Frontend**: 5173

---

## 👥 TIPOS DE UTILIZADORES

### **1. Personal Trainers (Treinadores)**
Profissionais de fitness que oferecem serviços de treino personalizado.
- **Trial automático**: 14 dias gratuitos ao registar
- **Planos disponíveis**: Basic (€15), Pro (€30), Premium (€50)
- **Avisos automáticos**: Email no dia 13 e bloqueio no dia 14
- **Auto-logout**: Sessão termina automaticamente quando trial expira

### **2. Clientes**
Utilizadores que procuram acompanhamento de personal trainers.
- **Sem trial**: Acesso ilimitado
- **Associação a trainers**: Sistema de busca e conexão
- **Cancelamento com motivo**: Sistema de feedback ao cancelar sessões

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### **Registo de Utilizadores**
- **Campos obrigatórios**: Nome, email, password
- **Campos opcionais**: Telefone
- **Seleção de role**: Trainer ou Cliente
- **Segurança**: Password encriptada com bcrypt (salt rounds: 10)
- **Validações**: 
  - Email único no sistema
  - Campos obrigatórios preenchidos
  - Formato de email válido

**Sistema de Trial Automático (Trainers apenas)**:
- ✅ **Trial de 14 dias** criado automaticamente ao registar
- ✅ Campos salvos: `trial_start_date`, `trial_end_date`, `subscription_plan: "trial"`
- ✅ `subscription_active: true` por defeito
- ✅ Clientes **não** têm trial (acesso ilimitado)

### **Login**
- **Autenticação** via email e password
- **Token JWT** gerado com validade de 2 dias
- **Payload do token**: ID do utilizador
- **Storage**: Token guardado em localStorage + dados do user (incluindo `trial_end_date`)
- **Middleware de proteção**: Rotas protegidas requerem token válido

**Verificação de Trial no Login (Trainers)**:
- ✅ Verifica se `trial_end_date` <= agora
- ✅ Se expirado: Retorna `403` com flag `trialExpired: true`
- ✅ Frontend redireciona para `/trial-expired`
- ✅ Bloqueia login até upgrade de plano

### **Autorização**
- **Role-based access control (RBAC)**
- Trainers só acedem aos seus próprios dados
- Clientes só veem dados do trainer associado
- Middleware valida permissões em cada rota

---

## 🏋️ FUNCIONALIDADES PARA PERSONAL TRAINERS

### **1. Dashboard Principal**

#### **Painel Overview (Visão Geral)**
- **Estatísticas em tempo real**:
  - Total de clientes associados
  - Agendamentos do mês atual
  - Sessões pendentes
  - Receita total
  - Pagamentos pendentes
- **Próximas sessões**: Lista das 5 próximas sessões agendadas
- **Ações rápidas**: Botões para criar slots, agendamentos e pacotes

#### **Gestão de Clientes**
- **Associar clientes**:
  - Sistema de busca de utilizadores registados como "client"
  - Pesquisa por nome ou email
  - Cards clicáveis com informações do utilizador
  - Associação com um clique
  - Email automático de boas-vindas ao cliente
- **Lista de clientes associados**:
  - Nome, email, telefone
  - Botão "👁️ Ver" - ✅ **NOVO**: Abre perfil completo inline (corrigido)
  - Botão "🗑️ Remover" - Desassocia cliente
- **Perfil detalhado do cliente** ✅ **NOVO ENDPOINT**:
  - **Endpoint**: `GET /api/auth/user/:id`
  - **Permissões**: Trainers só veem clientes associados
  - **Dados completos**: Nome, email, telefone, estatísticas
  - Dados pessoais completos
  - Estatísticas de sessões (completas, agendadas, total)
  - Informações médicas (se preenchidas)
  - Notas do trainer
  - Histórico das últimas 5 sessões com status

#### **Agendamentos (Appointments)**
- **Criar nova sessão**:
  - Selecionar cliente (dropdown combina `clients` + `associatedClients`)
  - ✅ **NOVO**: Lista inclui clientes manuais + clientes associados via User
  - Escolher data e hora
  - Duração da sessão
  - Notas opcionais
- **Visualizar todas as sessões**:
  - Lista completa ordenada por data
  - Informações: Cliente, data/hora, status
  - Status possíveis: booked (agendada), done (completa), cancelled (cancelada)
  - ✅ **NOVO**: Motivo de cancelamento visível (se cliente cancelou)
- **Gestão de sessões**:
  - Botão "Marcar como Completa"
  - Adicionar notas de treino após conclusão
  - Cancelar sessões
  - Ver notas de sessões anteriores
- **Emails automáticos**:
  - Confirmação ao agendar
  - Lembrete 24h antes (cron job diário às 10:00)
  - Notificação de cancelamento
  - Email após conclusão com notas de treino
  - ✅ **NOVO**: Email ao trainer quando cliente cancela (com motivo detalhado)

#### **Disponibilidade (Availability Slots)**
- **Criar slots de disponibilidade**:
  - Data e hora de início
  - Duração em minutos
  - Capacidade (vagas disponíveis)
- **Gestão de slots**:
  - Visualizar todos os slots criados
  - Editar slots existentes
  - Status: disponível/reservado
- **Marcação automática**: Slots são reservados quando cliente agenda

#### **Pacotes de Treino**
- **Criar pacotes**:
  - Título do pacote
  - Número de sessões incluídas
  - Preço total
  - Descrição detalhada
  - Status: ativo/inativo
- **Visualização**:
  - Cards com todas as informações
  - Preço por sessão calculado automaticamente
  - Botões de edição e desativação
- **Edição de pacotes**:
  - Alterar qualquer campo
  - Desativar pacotes (não apaga, mantém histórico)
- **Visibilidade**: Pacotes ativos aparecem automaticamente para clientes associados

#### **Pagamentos**
- **Registar pagamentos**:
  - Cliente associado
  - Valor
  - Método (Transferência, Dinheiro, Multibanco, MBWay)
  - Data
  - Descrição
- **Gestão de pagamentos**:
  - Listar todos os pagamentos
  - Alterar status: pending/completed/failed
  - Filtrar por status
- **Estatísticas financeiras**:
  - Total de receita
  - Pagamentos pendentes
  - Receita dos últimos 6 meses (gráfico mensal)
  - Métodos de pagamento mais usados

#### **Perfil do Trainer**
- **Editar informações**:
  - Nome completo
  - Email (fixo)
  - Telefone
  - Foto (URL)
  - Cidade
  - Biografia
  - Especialidades (múltiplas, ex: Musculação, Crossfit, Yoga)
  - Preço por sessão
- **Slug automático**: Gerado a partir do nome para URLs amigáveis
- **Visibilidade**: Perfil visível para todos os clientes associados

#### **Notificações/Emails**
- **Painel de testes**:
  - Testar configuração SMTP
  - Enviar email de teste
  - Forçar envio de lembretes
- **Logs de emails**: Visualizar histórico de envios

### **2. Sistema de Emails Automáticos**

#### **✅ 10 Tipos de Emails HTML (ATUALIZADO)**
1. **Email de Boas-vindas ao Cliente**
   - Enviado quando trainer associa um cliente
   - Informações do trainer (nome, email, telefone, foto)
   - Especialidades do trainer
   - Preço por sessão
   - Design: Glassmorphism premium

2. **Notificação ao Trainer**
   - Enviado quando novo cliente é associado
   - Dados do cliente
   - Data de associação

3. **Confirmação de Agendamento**
   - Enviado ao cliente após agendar sessão
   - Data e hora da sessão
   - Nome do trainer
   - Botão de confirmação visual

4. **Lembrete 24h Antes**
   - **Cron job automático** (todos os dias às 10:00 AM)
   - Enviado 24h antes da sessão
   - Detalhes da sessão
   - Contacto do trainer

5. **Cancelamento de Sessão**
   - Notificação quando sessão é cancelada
   - Motivo (se fornecido)
   - Sugestão para reagendar

6. **Sessão Completa com Notas**
   - Enviado após trainer marcar sessão como completa
   - Notas do treino realizadas pelo trainer
   - Exercícios, progressos, observações
   - Opção de feedback

7. **✅ NOVO: Aviso de Trial (Dia 13)** `sendTrialWarningEmail`
   - Enviado automaticamente 13 dias após registo
   - **Cron job diário** às 10:00 AM
   - Gradiente laranja, ícone de timer
   - Mostra data exata de expiração
   - Lista 3 planos disponíveis (Basic, Pro, Premium)
   - Mensagem: "Resta apenas 1 dia!"

8. **✅ NOVO: Trial Expirado (Dia 14)** `sendTrialExpiredEmail`
   - Enviado quando trial expira (14 dias)
   - **Cron job diário** às 10:00 AM
   - Gradiente vermelho, mensagem "Conta Suspensa"
   - Call-to-action para upgrade
   - Detalhes completos dos 3 planos
   - `subscription_active = false` ativado

9. **✅ NOVO: Notificação de Cancelamento ao Trainer** `sendClientCancellationNotification`
   - Enviado quando **cliente cancela** sessão
   - **Triggered** por ação do cliente (não cron)
   - Inclui:
     - **Nome do cliente**
     - **Email do cliente**
     - **Telemóvel do cliente** (se disponível)
     - **Data e hora da sessão cancelada**
     - **Motivo do cancelamento** (obrigatório)
   - Design: Alerta amarelo com border lateral
   - Permite trainer contactar cliente para reagendar

10. **Email de Cancelamento ao Cliente** (atualizado)
    - Confirmação de cancelamento
    - Sugestão de novo agendamento

#### **Configuração SMTP**
- **Provider**: Gmail
- **Host**: smtp.gmail.com
- **Porta**: 587
- **Segurança**: STARTTLS
- **App Password**: Configuração em .env
- **Templates**: HTML responsivo com inline CSS

### **3. Agendador de Tarefas (Cron Jobs)**

#### **✅ Cron Job 1: Lembrete Automático de Sessões**
- **Frequência**: Diário às 10:00 AM
- **Schedule**: `'0 10 * * *'`
- **Arquivo**: `backend/services/reminderScheduler.js`
- **Lógica**:
  1. Busca todas as sessões com status "booked"
  2. Filtra sessões que acontecem daqui a 24h
  3. Envia email de lembrete para cada cliente
- **Campos enviados**: Data, hora, nome do trainer, contacto

#### **✅ Cron Job 2: Verificação de Trials (NOVO)**
- **Frequência**: Diário às 10:00 AM
- **Schedule**: `'0 10 * * *'`
- **Arquivo**: `backend/services/trialCheckScheduler.js`
- **Iniciado em**: `backend/index.js` (junto com reminder scheduler)

**Lógica de Aviso (Dia 13)**:
1. Busca trainers onde `trial_start_date <= (agora - 13 dias)` AND `trial_end_date > agora`
2. Filtra apenas quem tem `trial_warning_sent = false`
3. Envia `sendTrialWarningEmail` para cada trainer
4. Atualiza `trial_warning_sent = true`
5. Logs detalhados: tempo restante em segundos

**Lógica de Expiração (Dia 14)**:
1. Busca trainers onde `trial_end_date <= agora` AND `subscription_active = true`
2. Envia `sendTrialExpiredEmail` para cada trainer
3. Atualiza `subscription_active = false`
4. Trainer bloqueado de fazer login até upgrade
5. Logs: "Trial expirado para [nome]"

**Console Logs**:
```
⏰ Verificação de trials iniciada (10:00 AM diariamente)
📊 Trainers para aviso: X
📧 Enviando email de aviso para: [email]
⏳ Tempo restante: X segundos
📊 Trainers para desativar: X
🔒 Trial expirado para [nome] - conta desativada
```

---

## 👤 FUNCIONALIDADES PARA CLIENTES

### **1. Dashboard do Cliente**

#### **Painel Overview**
- **Informações do Trainer Associado**:
  - Card destacado com foto/inicial
  - Nome, email, telefone, cidade
  - Preço por sessão
  - Especialidades em badges
  - Bio completa
  - **Clicável**: Abre perfil completo inline
- **Quando não tem trainer**:
  - Mensagem informativa
  - Instrução: "Contacta um trainer e fornece teu email"
- **Estatísticas pessoais**:
  - Total de sessões realizadas
  - Sessões completas
  - Próxima sessão agendada
- **Próxima sessão**: Card em destaque com data/hora e botão de cancelar

#### **Minhas Sessões**
- **Lista completa** de todas as sessões:
  - Sessões agendadas
  - Sessões completas
  - Sessões canceladas
- **Informações por sessão**:
  - Data e hora
  - Status visual com cores
  - Notas de treino (se completa)
  - Avaliação deixada (se completa)
- **Ações disponíveis**:
  - **✅ Cancelar sessão** (NOVO MODAL):
    - Clique abre `CancellationModal`
    - Mostra data/hora da sessão
    - Campo de texto obrigatório para motivo
    - Mensagem: "O teu personal trainer será notificado por email"
    - Botões: "✅ Confirmar Cancelamento" / "❌ Voltar"
    - Após confirmar:
      - Status → "cancelled"
      - Campo `cancellation_reason` salvo
      - Email enviado ao trainer com todos os detalhes
      - Alert: "Sessão cancelada! O teu personal trainer foi notificado por email."
  - **Avaliar** sessão completa (1-5 estrelas + feedback texto)
  - **Ver notas** do trainer após sessão

#### **Sistema de Avaliação**
- **Avaliar sessão completa**:
  - Rating de 1 a 5 estrelas (seleção visual)
  - Feedback textual detalhado
  - Campos: client_rating, client_feedback
- **Histórico**: Avaliações ficam guardadas e visíveis no histórico

#### **Pacotes Disponíveis**
- **Visualização de pacotes do trainer**:
  - Se **não tem trainer**: Mensagem informativa
  - Se **tem trainer**: Lista todos os pacotes ativos
- **Card de cada pacote**:
  - **Informações do trainer** no topo (nome, cidade, foto)
  - Título do pacote
  - Preço total destacado
  - Número de sessões
  - Preço por sessão (calculado)
  - Descrição completa
  - Botão "💳 Comprar Pacote"
- **Click no trainer**: Abre perfil completo inline

#### **Perfil do Trainer (Visualização Detalhada)**
- **Aparece inline** quando cliente clica no trainer
- **Scroll automático** para a seção
- **Botão "✕ Fechar"** no canto superior direito (z-index alto)
- **Informações completas**:
  - Foto/inicial grande
  - Nome e localização
  - Contactos (email, telefone)
  - Preço por sessão em destaque
  - Especialidades com badges coloridos
  - Biografia completa
- **Design**: Gradiente verde-azul, sem overlay preto

### **2. Experiência de Utilizador**

#### **Interface Intuitiva**
- **Design glassmorphism**: Efeitos de vidro fosco
- **Gradientes animados**: Background com movimento suave
- **Hover effects**: Feedback visual em todos os elementos clicáveis
- **Animações**: slideIn, fadeIn, pulse, glow
- **Responsivo**: Adapta-se a desktop, tablet e mobile

#### **Notificações Visuais**
- Alerts JavaScript para ações críticas
- Confirmações antes de cancelamentos
- Feedback de sucesso/erro em formulários

---

## 🌟 LANDING PAGE E SISTEMA DE PREÇOS

### **✅ Landing Page Profissional (NOVO)**
**Componente**: `frontend/src/components/LandingPage.jsx` (285 linhas)
**Rota**: `/` (página inicial antes do login)

#### **Seções da Landing Page**:

1. **Hero Section**
   - Título: "Transforma O Teu Negócio de Personal Training"
   - Subtítulo: "Plataforma completa para gerir clientes, agendamentos e pagamentos"
   - CTA button: "Começar Gratuitamente" → `/register`
   - Estatísticas em badges:
     - 500+ Personal Trainers
     - 10,000+ Clientes Ativos
     - 50,000+ Sessões Realizadas

2. **Features Section** (8 cards)
   - Gestão de Clientes
   - Agendamentos Inteligentes
   - Pacotes Personalizados
   - Pagamentos Facilitados
   - Emails Automáticos
   - Dashboard Analytics
   - App Mobile (coming soon)
   - Suporte 24/7

3. **Demo Section** (4 screenshots simulados)
   - Dashboard overview
   - Lista de clientes
   - Calendário de agendamentos
   - Gráficos financeiros

4. **Pricing Section** ⭐ **PRINCIPAL**
   - **3 Planos Disponíveis**:
   
   **Basic** - €15/mês
   - Até 20 clientes
   - 100 agendamentos/mês
   - Suporte email
   - Dashboard básico
   
   **Pro** - €30/mês ⭐ POPULAR
   - Até 50 clientes
   - Agendamentos ilimitados
   - Emails automáticos
   - Analytics avançado
   - Suporte prioritário
   - Badge "Mais Popular"
   
   **Premium** - €50/mês
   - Clientes ilimitados
   - Tudo do Pro +
   - App mobile dedicada
   - API access
   - White label
   - Gestor de conta dedicado

5. **Testimonials** (3 testemunhos simulados)

6. **Final CTA**
   - "Pronto Para Crescer?"
   - Trial de 14 dias grátis
   - Sem cartão de crédito

7. **Footer**
   - Links de navegação
   - Redes sociais
   - Copyright

#### **Design**:
- Glassmorphism premium
- Gradientes animados de fundo
- Hover effects em todos os cards
- Scroll suave
- 100% responsivo

#### **Lógica de Navegação**:
```javascript
const handleGetStarted = (plan) => {
  localStorage.setItem('selectedPlan', plan); // Salva plano escolhido
  navigate('/register'); // Redireciona para registo
};
```

### **✅ Página Trial Expired (NOVO)**
**Componente**: `frontend/src/components/TrialExpired.jsx` (266 linhas)
**Rota**: `/trial-expired`

#### **Quando Aparece**:
- Trainer tenta fazer login após dia 14
- Auto-logout detecta trial expirado
- Acesso bloqueado até upgrade

#### **Conteúdo**:
- Timer emoji grande (⏰) com animação
- Warning box: "O teu período experimental de 14 dias terminou"
- Mensagem: "Para continuar a usar a plataforma, escolhe um dos nossos planos"
- **3 Cards de Planos** (mesmo layout da landing page)
- Botão "Fazer Upgrade" em cada plano (placeholder para Stripe/PayPal)
- Design: Gradiente laranja, atmosfera urgente mas profissional

### **✅ Sistema de Trial Automático**

#### **Criação Automática no Registo**:
```javascript
// backend/routes/authRoutes.js - POST /register
const now = new Date();
const trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 dias

if (userRole === "trainer") {
  userData.subscription_plan = "trial";
  userData.trial_start_date = now;
  userData.trial_end_date = trialEndDate;
  userData.subscription_active = true;
  userData.trial_warning_sent = false;
}
```

#### **Verificação no Login**:
```javascript
// Se for trainer e trial expirou
if (user.role === 'trainer' && user.trial_end_date && new Date() >= user.trial_end_date) {
  return res.status(403).json({ 
    msg: "Trial expirado", 
    trialExpired: true 
  });
}
```

#### **Auto-Logout no Frontend (4 camadas)**:
**Componente**: `TrainerDashboard.jsx`

1. **Check Local (1 segundo)**:
```javascript
const checkLocalTrialExpiry = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.trial_end_date && new Date() >= new Date(user.trial_end_date)) {
    handleTrialExpired(); // Logout + redirect
  }
};
setInterval(checkLocalTrialExpiry, 1000);
```

2. **Check Server (3 segundos)**:
```javascript
const checkTrialStatus = async () => {
  const res = await fetch('/api/appointments/stats/dashboard');
  if (res.status === 403) {
    const data = await res.json();
    if (data.trialExpired) handleTrialExpired();
  }
};
setInterval(checkTrialStatus, 3000);
```

3. **Response Interceptor** (em todas as requests):
```javascript
const handleFetchResponse = (res) => {
  if (res.status === 403) {
    // Check data.trialExpired
  }
};
```

4. **Visibility Change Listener**:
```javascript
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) checkTrialStatus();
});
```

#### **Middleware de Proteção**:
**Arquivo**: `backend/middleware/checkTrialStatus.js`
```javascript
// Bloqueia acesso a rotas protegidas se trial expirou
if (user.role === 'trainer' && user.trial_end_date) {
  if (new Date() >= user.trial_end_date) {
    return res.status(403).json({ 
      msg: "Trial expirado", 
      trialExpired: true 
    });
  }
}
```

**Aplicado em**:
- `GET /api/appointments`
- `GET /api/appointments/stats/dashboard`
- Todas as rotas de modificação de dados

---

## 📊 MODELOS DE DADOS (MongoDB)

### **1. User (Utilizadores)**
```javascript
{
  name: String (obrigatório),
  email: String (único, obrigatório),
  password: String (encriptado, obrigatório),
  role: String (enum: ["trainer", "client"], default: "client"),
  phone: String,
  
  // Campos exclusivos de Trainers:
  photo_url: String,
  city: String,
  specialties: [String],
  bio: String,
  price_per_session: Number (default: 0),
  currency: String (default: "EUR"),
  slug: String (único, gerado automaticamente),
  
  // ✅ NOVOS CAMPOS - Sistema de Subscription/Trial (Trainers apenas):
  subscription_plan: String (enum: ["trial", "basic", "pro", "premium"], default: "trial"),
  trial_start_date: Date, // Data de início do trial
  trial_end_date: Date, // Data de fim do trial (14 dias após start)
  subscription_active: Boolean (default: true), // False = bloqueado
  trial_warning_sent: Boolean (default: false), // Email de aviso enviado?
  
  // Campos exclusivos de Clientes:
  trainer_id: ObjectId (ref: "User"),
  
  created_at: Date (default: Date.now)
}
```

### **2. Client (Clientes - Histórico)**
```javascript
{
  trainer_id: ObjectId (ref: "User", obrigatório),
  name: String (obrigatório),
  email: String (obrigatório),
  phone: String,
  notes: String,
  medical_info: String,
  created_at: Date (default: Date.now)
}
```
*Nota: Modelo antigo mantido para compatibilidade. Novos clientes são geridos via User.trainer_id*

### **3. AvailabilitySlot (Slots de Disponibilidade)**
```javascript
{
  trainer_id: ObjectId (ref: "User", obrigatório),
  start_datetime: Date (obrigatório),
  duration_minutes: Number (obrigatório),
  capacity: Number (default: 1),
  booked: Boolean (default: false),
  created_at: Date (default: Date.now)
}
```

### **4. Appointment (Agendamentos)**
```javascript
{
  trainer_id: ObjectId (ref: "User", obrigatório),
  client_id: ObjectId (ref: "User", obrigatório),
  client_name: String (obrigatório),
  client_email: String (obrigatório), // Para identificar cliente quando cancela
  client_phone: String,
  start_datetime: Date (obrigatório),
  end_datetime: Date (obrigatório), // Calculado: start + duration
  notes: String,
  status: String (enum: ["booked", "done", "cancelled", "no-show"], default: "booked"),
  payment_status: String (enum: ["pending", "paid", "refunded"], default: "pending"),
  payment_id: String,
  
  // Campos de pós-sessão:
  workout_notes: String, // Notas do trainer após sessão
  client_rating: Number (min: 1, max: 5), // Avaliação do cliente
  client_feedback: String, // Feedback textual do cliente
  
  // ✅ NOVO CAMPO - Sistema de Cancelamento:
  cancellation_reason: String, // Motivo quando cliente cancela
  
  created_at: Date (default: Date.now)
}
```

### **5. Package (Pacotes de Treino)**
```javascript
{
  trainer_id: ObjectId (ref: "User", obrigatório),
  title: String (obrigatório),
  sessions_count: Number (obrigatório),
  price: Number (obrigatório),
  description: String,
  active: Boolean (default: true),
  created_at: Date (default: Date.now)
}
```

### **6. Payment (Pagamentos)**
```javascript
{
  trainer_id: ObjectId (ref: "User", obrigatório),
  client_id: ObjectId (ref: "User", obrigatório),
  client_name: String (obrigatório),
  amount: Number (obrigatório),
  payment_method: String (enum: ["card", "cash", "bank_transfer", "mbway"], default: "cash"),
  status: String (enum: ["pending", "completed", "failed"], default: "pending"),
  description: String,
  payment_date: Date (default: Date.now),
  created_at: Date (default: Date.now)
}
```

---

## 🔌 API REST - ENDPOINTS

### **Autenticação (/api/auth)**

#### **POST /register**
- **Descrição**: Criar nova conta
- **Body**: `{ name, email, password, phone?, role? }`
- **Resposta**: Mensagem de sucesso

#### **POST /login**
- **Descrição**: Autenticar utilizador
- **Body**: `{ email, password }`
- **Resposta**: `{ token, user: { id, name, email, role, phone, trainer_id } }`

#### **GET /trainer/:id**
- **Descrição**: Buscar dados de um trainer
- **Auth**: Não requerida (pública)
- **Resposta**: Objeto User completo (sem password)

#### **GET /trainers**
- **Descrição**: Listar todos os trainers
- **Auth**: Não requerida
- **Resposta**: Array de trainers com dados públicos

#### **GET /users-clients**
- **Descrição**: Listar todos os utilizadores com role "client"
- **Auth**: Token requerido
- **Resposta**: Array de clientes

#### **✅ GET /user/:id** (NOVO)
- **Descrição**: Buscar User por ID (para ver perfil de cliente associado)
- **Auth**: Token requerido
- **Permissões**: 
  - Trainers só veem clientes onde `user.trainer_id === trainer.id`
  - Retorna 403 se não autorizado
- **Resposta**: User sem password
- **Uso**: Modal "Ver" cliente no TrainerDashboard

#### **PUT /profile**
- **Descrição**: Atualizar perfil do utilizador autenticado
- **Auth**: Token requerido
- **Body**: `{ name, phone, city, bio, specialties, price_per_session, photo_url }`
- **Resposta**: User atualizado

#### **POST /associate-trainer** *(DEPRECATED)*
- **Descrição**: Cliente associar-se a trainer (não usado no fluxo atual)

### **Clientes (/api/clients)**

#### **GET /**
- **Descrição**: Listar clientes do trainer autenticado
- **Auth**: Token requerido
- **Resposta**: Array de clientes

#### **POST /**
- **Descrição**: Criar cliente (mantido para compatibilidade)
- **Auth**: Token requerido
- **Body**: `{ name, email, phone, notes, medical_info }`
- **Emails**: Envia boas-vindas ao cliente e notificação ao trainer

#### **POST /associate-user**
- **Descrição**: Associar um User (role client) ao trainer
- **Auth**: Token requerido
- **Body**: `{ user_id }`
- **Email**: Boas-vindas ao cliente
- **Resposta**: Mensagem e dados do cliente

#### **POST /dissociate-user/:userId**
- **Descrição**: Remover associação de cliente
- **Auth**: Token requerido
- **Validação**: Verifica se cliente pertence ao trainer
- **Resposta**: Mensagem de confirmação

#### **GET /:id**
- **Descrição**: Buscar cliente específico do trainer
- **Auth**: Token requerido

#### **PUT /:id**
- **Descrição**: Atualizar dados do cliente
- **Auth**: Token requerido

#### **DELETE /:id**
- **Descrição**: Remover cliente
- **Auth**: Token requerido

### **Disponibilidade (/api/availability)**

#### **GET /**
- **Descrição**: Listar slots do trainer
- **Auth**: Token requerido

#### **POST /**
- **Descrição**: Criar novo slot
- **Auth**: Token requerido
- **Body**: `{ start_datetime, duration_minutes, capacity }`

#### **GET /trainer/:trainerId**
- **Descrição**: Slots públicos de um trainer
- **Auth**: Não requerida
- **Query**: `?date=YYYY-MM-DD` (opcional)

#### **PUT /:id**
- **Descrição**: Atualizar slot
- **Auth**: Token requerido

#### **DELETE /:id**
- **Descrição**: Remover slot
- **Auth**: Token requerido

### **Agendamentos (/api/appointments)**

#### **GET /**
- **Descrição**: Todos os agendamentos do trainer
- **Auth**: Token requerido

#### **GET /my**
- **Descrição**: Agendamentos do cliente autenticado
- **Auth**: Token requerido

#### **GET /stats/dashboard**
- **Descrição**: Estatísticas para dashboard do trainer
- **Auth**: Token requerido
- **Resposta**: `{ totalClients, appointmentsThisMonth, upcomingAppointments }`

#### **GET /client/:clientId**
- **Descrição**: Agendamentos de um cliente específico
- **Auth**: Token requerido

#### **POST /**
- **Descrição**: Criar agendamento
- **Auth**: Token requerido
- **Body**: `{ client_id, client_name, start_datetime, duration_minutes, notes }`
- **Email**: Confirmação ao cliente

#### **✅ PATCH /:id** (ATUALIZADO)
- **Descrição**: Atualizar agendamento (status, notas, avaliação, cancelamento)
- **Auth**: Token requerido
- **Body**: `{ status?, notes?, workout_notes?, client_rating?, client_feedback?, cancellation_reason? }`
- **Permissões** ✅ **NOVO**:
  - **Trainers**: Podem atualizar tudo nos seus appointments
  - **Clientes**: Só podem cancelar (`status: "cancelled"`) nos próprios appointments
  - Validação: `user.email === appointment.client_email`
  - Retorna 403 se não autorizado
- **Emails**: 
  - Cancelamento se status = "cancelled"
  - ✅ **NOVO**: Se `isClient && cancellation_reason`, envia `sendClientCancellationNotification` ao trainer
  - Sessão completa se status = "done" e workout_notes existe
- **Logs de Debug**:
  ```
  🔍 Verificação de permissões: { userId, userEmail, isTrainer, isClient }
  📧 Verificação de emails: { hasTrainer, status, hasCancellationReason }
  📤 Enviando email ao trainer: [email]
  ```

### **Pacotes (/api/packages)**

#### **GET /**
- **Descrição**: Pacotes ativos do trainer
- **Auth**: Token requerido

#### **GET /trainer/:trainerId**
- **Descrição**: Pacotes públicos de um trainer (com populate)
- **Auth**: Não requerida
- **Populate**: Dados completos do trainer
- **Filtro**: Apenas ativos

#### **POST /**
- **Descrição**: Criar pacote
- **Auth**: Token requerido
- **Body**: `{ title, sessions_count, price, description }`

#### **PUT /:id**
- **Descrição**: Atualizar pacote
- **Auth**: Token requerido

#### **DELETE /:id**
- **Descrição**: Desativar pacote (soft delete: active = false)
- **Auth**: Token requerido

### **Pagamentos (/api/payments)**

#### **GET /**
- **Descrição**: Todos os pagamentos do trainer
- **Auth**: Token requerido

#### **GET /stats**
- **Descrição**: Estatísticas financeiras
- **Auth**: Token requerido
- **Resposta**:
  - `total`: Soma de pagamentos completados
  - `pending`: Soma de pendentes
  - `monthlyRevenue`: Array dos últimos 6 meses [{ month, revenue }]

#### **POST /**
- **Descrição**: Registar pagamento
- **Auth**: Token requerido
- **Body**: `{ client_id, client_name, amount, payment_method, description }`

#### **PUT /:id/status**
- **Descrição**: Atualizar status de pagamento
- **Auth**: Token requerido
- **Body**: `{ status: "pending" | "completed" | "failed" }`

### **Emails (/api/emails)**

#### **GET /test**
- **Descrição**: Testar configuração SMTP
- **Auth**: Token requerido
- **Resposta**: Status da conexão

#### **POST /send-test**
- **Descrição**: Enviar email de teste
- **Auth**: Token requerido
- **Body**: `{ to, subject, message }`

#### **POST /test-reminders**
- **Descrição**: Forçar envio de lembretes
- **Auth**: Token requerido
- **Ação**: Executa cron job manualmente

---

## 🔒 SEGURANÇA

### **Autenticação e Autorização**
- **Passwords**: Encriptadas com bcrypt (10 salt rounds)
- **JWT Tokens**: Assinados com secret key, validade 2 dias
- **Middleware de autenticação**: Verifica token em todas as rotas protegidas
- **RBAC**: Role-based access control (trainer vs client)
- **Validações**: Ownership checks (trainer só vê seus clientes)

### **Proteção de Dados**
- **Mongoose validation**: Campos obrigatórios e tipos
- **Mongoose unique indexes**: Email único
- **Select exclusions**: Password nunca retornada em queries
- **ObjectId validation**: Previne injection attacks

### **Variáveis de Ambiente (.env)**
```
MONGO_URI=mongodb://127.0.0.1:27017/myfitness
JWT_SECRET=seu_secret_muito_seguro
PORT=5000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=app_password_gerado
FRONTEND_URL=http://localhost:5173
```

---

## 🎨 DESIGN E UX

### **Tema Visual** ✅ **ATUALIZADO - Design Fitness Único Vermelho/Preto/Branco**

#### **Filosofia de Design**
Design totalmente único criado para personal trainers, fugindo dos padrões habituais de aplicações web. Inspirado em força, energia e profissionalismo do mundo fitness.

#### **Cores Principais**
- **Vermelho Crimson**: #dc143c (primário, CTAs, destaque)
- **Vermelho Hover**: #b81134 (hover states)
- **Vermelho Intenso**: #ff1744 (acentos, gradientes)
- **Vermelho Escuro**: #8b0000 (secundário, sombras)
- **Preto**: #1a1a1a, #2d2d2d (backgrounds escuros)
- **Branco**: #ffffff (cards, modais)
- **Cinza Escuro**: #1a1a1a (textos em fundos claros)
- **Cinza Médio**: #666666 (textos secundários)
- **Cinza Claro**: #e0e0e0, #f8f8f8 (bordas, backgrounds sutis)

#### **Características Únicas do Design**

**1. Bordas Angulares (Força)**
- `border-radius: 2px` em todos os elementos
- Visual mais forte e profissional
- Contrasta com designs arredondados comuns

**2. Barra Lateral Vermelha (Marca Visual)**
- Cards com `border-left: 4px solid #dc143c`
- Identidade visual instantânea
- Hierarquia clara de informação

**3. Tipografia Forte**
- **Headings**: `font-weight: 800`, UPPERCASE, `letter-spacing: 0.5-1px`
- **Buttons**: UPPERCASE, espaçamento aumentado
- **Texto alinhado à esquerda** em todos os componentes
- Contraste alto para legibilidade

**4. Background com Grid Pattern**
- Container escuro com padrão de grid sutil vermelho
- Simula textura de tatame/academia
- Background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`
- Pattern CSS sobreposto com `opacity: 0.3`

**5. Interações Dinâmicas**
- **Cards**: Setas animadas → aparecem no hover
- **Inputs**: Deslizam 2px para direita ao focar
- **Botões**: Sweep effect de luz da esquerda para direita
- **Links**: Linha vermelha cresce embaixo no hover
- **Dividers**: Gradiente vermelho que desaparece

**6. Elementos Fitness Específicos**
- **Badges**: Barra lateral colorida + background sutil
- **Tabs**: Borda superior vermelha quando ativa
- **Sections**: Detalhe vermelho em degradê no topo
- **Appointment items**: Gradiente vertical na borda esquerda
- **Dashboard header**: Linha decorativa com gradiente

#### **Componentes Estilizados**

**Cards/Boxes**
```css
background: #ffffff;
border-left: 4px solid #dc143c;
border-radius: 2px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
text-align: left;
```

**Botões Primários**
```css
background: linear-gradient(135deg, #dc143c 0%, #b81134 100%);
text-transform: uppercase;
letter-spacing: 1px;
font-weight: 700;
border-radius: 2px;
box-shadow: 0 4px 15px rgba(220, 20, 60, 0.3);
```

**Inputs**
```css
background: #fafafa;
border: 2px solid #e0e0e0;
border-radius: 2px;
color: #1a1a1a;
font-weight: 500;
/* Focus: desliza para direita + borda vermelha */
```

**Stat Cards**
```css
background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
border-left: 4px solid #dc143c;
/* Detalhe angular no canto superior direito */
```

#### **Animações Suaves**
- **slideIn**: 0.4s ease (entrada de elementos)
- **Hover transitions**: 0.3s ease
- **Transform**: translateY(-4px) em hover de cards
- **Box-shadow**: Cresce suavemente com vermelho
- Sem animações excessivas (design limpo)

#### **Sistema de Cores Consistente**
- ✅ **Totalmente limpo** de cores verdes e azuis antigas
- ✅ Landing page 100% vermelho/preto/branco
- ✅ Todos os box-shadows usam `rgba(220, 20, 60, ...)`
- ✅ Country selector corrigido (texto visível)
- ✅ User info corrigida (cinza em vez de vermelho em branco)

### **Componentes Reutilizáveis**
- **Box**: Container principal com glassmorphism
- **Section**: Seções de conteúdo com bordas
- **Button**: Botões com hover effects e gradientes
- **Modal**: Popup centralizado (usado em alguns componentes)
- **Profile Section**: Seção inline para perfis (substitui modals)
- **Form Group**: Inputs estilizados consistentes
- **Client Item/Card**: Cards de clientes e utilizadores
- **Stats Grid**: Grid responsivo de estatísticas
- **Tabs**: Sistema de navegação por abas

### **✅ Novos Componentes (Última Atualização)**

#### **LandingPage.jsx** (285 linhas)
- Landing page completa com 7 seções
- Pricing cards com 3 planos
- Hero section com estatísticas
- Features grid (8 items)
- Testimonials carousel
- Responsivo e animado
- Navegação para registo com plano selecionado

#### **TrialExpired.jsx** (266 linhas)
- Página de upgrade após trial expirar
- 3 cards de planos (mesmo design da landing)
- Warning box destacado
- Timer emoji com animação
- Placeholder para integração de pagamento
- CTA urgente mas profissional

#### **CancellationModal.jsx** (95 linhas) ✅ **NOVO**
- Modal para cancelamento de sessões pelo cliente
- Props: `{ appointment, onClose, onConfirm }`
- **Layout**:
  - Título: "⚠️ Cancelar Sessão"
  - Box amarelo com data/hora da sessão
  - Textarea obrigatória para motivo
  - Aviso: "O teu personal trainer será notificado por email"
  - Botões: Confirmar (vermelho) / Voltar
- **Validação**: Campo de motivo obrigatório
- **Callback**: `onConfirm(reason)` → salva + envia email
- **Design**: Glassmorphism, max-width 500px, centralizado

#### **ClientProfileSection.jsx** (atualizado)
- **Endpoint mudado**: `/api/clients/:id` → `/api/auth/user/:id`
- Agora busca Users (clientes associados) em vez de Clients
- Mantém mesmo layout e funcionalidades
- Loading state e error handling
- Scroll automático ao abrir

### **Animações**
- **gradient**: Background animado (20s)
- **float**: Efeitos flutuantes (10-12s)
- **slideIn**: Entrada de elementos
- **pulse**: Pulsação de destaque
- **glow**: Brilho animado
- **fadeIn**: Fade suave em modals

### **Responsividade**
- **Desktop**: Layout completo com sidebars
- **Tablet**: Grid adaptativo (768px breakpoint)
- **Mobile**: Stack vertical, touch-friendly (480px breakpoint)

---

## 📧 SISTEMA DE EMAILS

### **Templates HTML Premium**
Todos os emails usam template HTML responsivo com:
- **Design glassmorphism**: Consistente com a aplicação
- **Gradientes**: Cabeçalhos com cores da marca
- **Inline CSS**: Compatibilidade máxima
- **Responsivo**: Adapta-se a todos os devices
- **Links clicáveis**: Mailto, tel, botões de ação

### **Configuração SMTP**
- **Provider**: Gmail com App Password
- **Autenticação**: PLAIN (user + pass)
- **TLS**: Ativado (587)
- **Segurança**: rejectUnauthorized: false (desenvolvimento)

### **Erro Handling**
- Try-catch em todos os envios
- Logs detalhados no console
- Não bloqueia operações principais
- Promises.catch() para operações assíncronas

---

## ⚙️ CONFIGURAÇÃO E DEPLOYMENT

### **Instalação**

#### Backend
```bash
cd backend
npm install
# Criar .env com variáveis necessárias
node index.js
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### **Variáveis de Ambiente Requeridas**
- `MONGO_URI`: String de conexão MongoDB
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta do servidor (default: 5000)
- `EMAIL_HOST`: SMTP host
- `EMAIL_PORT`: SMTP port
- `EMAIL_USER`: Email de envio
- `EMAIL_PASS`: App password
- `FRONTEND_URL`: URL do frontend para links

### **Scripts PowerShell**
- **restart.ps1**: Reinicia servidor backend com validação de .env

---

## 🚀 FUNCIONALIDADES FUTURAS (PRONTAS PARA IMPLEMENTAÇÃO)

### **1. Pagamentos Online**
- Estrutura de Payment já existe
- Integração Stripe/PayPal necessária
- Campo `payment_method` suporta "card"
- Webhook handlers prontos para adicionar

### **2. Upload de Imagens**
- Campo `photo_url` existe em User
- Adicionar upload para servidor/cloud
- Sugestão: Cloudinary, AWS S3

### **3. Gráficos e Analytics**
- Dados mensais já calculados (`monthlyRevenue`)
- Integrar Chart.js ou Recharts
- Gráficos de receita, sessões, clientes

### **4. Chat em Tempo Real**
- WebSockets (Socket.io)
- Chat trainer-cliente
- Notificações em tempo real

### **5. Planos de Treino Detalhados**
- Novo modelo: WorkoutPlan
- Exercícios, séries, repetições
- Progresso do cliente

### **6. Aplicação Mobile**
- API REST já suporta
- React Native recomendado
- Mesma lógica de negócio

---

## 📊 MÉTRICAS E ESTATÍSTICAS

### **Dashboard Trainer**
- Total de clientes associados (COUNT User com trainer_id)
- Agendamentos do mês (COUNT Appointment do mês atual)
- Próximas sessões (5 mais recentes com status "booked")
- Receita total (SUM Payment com status "completed")
- Pagamentos pendentes (SUM Payment com status "pending")
- Receita mensal últimos 6 meses (Aggregate por mês)

### **Dashboard Cliente**
- Total de sessões (COUNT Appointment)
- Sessões completas (COUNT status = "done")
- Próxima sessão (Appointment mais próxima com status "booked")

---

## 🛠️ MANUTENÇÃO E BOAS PRÁTICAS

### **Código**
- Comentários em pontos críticos
- Tratamento de erros try-catch
- Validações de input
- Mongoose schema validation
- Middleware de autenticação reutilizável
- Componentes React reutilizáveis

### **Base de Dados**
- Indexes em campos únicos (email)
- ObjectId references para relationships
- Default values definidos
- Timestamps automáticos (created_at)

### **Performance**
- Populate seletivo (apenas campos necessários)
- Lazy loading de componentes
- LocalStorage para token (evita re-fetch)
- Cron job otimizado (filtra antes de processar)

---

## 📝 CONCLUSÃO

A **Plataforma MyFitness** é uma solução completa e moderna para gestão de personal trainers e clientes. Com funcionalidades abrangentes desde autenticação segura até automação de emails, o sistema oferece uma experiência profissional e eficiente.

### **Destaques Principais**
✅ Sistema de autenticação robusto com JWT  
✅ Gestão completa de clientes e agendamentos  
✅ **Landing page profissional com pricing**  
✅ **Sistema de trial de 14 dias automático**  
✅ **10 templates de email** (incluindo trial warning/expired/cancelamento)  
✅ **2 Cron jobs** (lembretes + verificação de trials)  
✅ **Auto-logout em 4 camadas** quando trial expira  
✅ **Modal de cancelamento com motivo obrigatório**  
✅ **Email ao trainer quando cliente cancela** (com todos os detalhes)  
✅ Sistema de avaliações e feedback  
✅ Pacotes de treino customizáveis  
✅ Gestão financeira com estatísticas  
✅ Interface moderna com glassmorphism  
✅ 100% responsivo  
✅ API REST bem estruturada com permissões granulares  

### **Estado Atual**
- ✅ **Backend**: Totalmente funcional
- ✅ **Frontend**: Interface completa com landing page
- ✅ **Emails**: 10 templates automáticos operacionais
- ✅ **Autenticação**: Segura e testada com trial system
- ✅ **CRUD Completo**: Todas as entidades
- ✅ **Trial System**: 14 dias com avisos e bloqueio automático
- ✅ **Cron Jobs**: 2 schedulers (lembretes + trials) rodando diariamente
- ✅ **Cancelamento Avançado**: Modal + motivo + email ao trainer
- ✅ **Auto-logout**: 4 camadas de verificação
- ✅ **Permissões Granulares**: Clientes podem cancelar suas próprias sessões
- ⚠️ **Pagamentos Online**: Estrutura pronta, integração Stripe/PayPal pendente
- ⚠️ **Upload Imagens**: Campo pronto, upload pendente

### **Escalabilidade**
O sistema está preparado para crescer com:
- Arquitetura modular
- API RESTful bem definida
- Base de dados NoSQL flexível
- Frontend component-based
- Fácil integração com serviços externos

---

## 🛠️ SCRIPTS DE MANUTENÇÃO

### **Scripts de Trials (backend/)**

#### **check-trials.js**
```bash
node check-trials.js
```
- Lista os últimos 5 trainers com seus dados de trial
- Mostra `trial_start_date`, `trial_end_date`, `trial_warning_sent`
- Calcula tempo restante em dias/horas/minutos
- Útil para debug e verificação manual

#### **fix-existing-trainers.js**
```bash
node fix-existing-trainers.js
```
- Adiciona trial a trainers criados antes do sistema de trial
- Busca trainers sem `subscription_plan`
- Cria trial de 14 dias a partir de AGORA
- Atualiza todos os campos necessários
- **Usar apenas uma vez** após implementar trial system

#### **force-trial-check.js**
```bash
node force-trial-check.js
```
- Executa verificação de trials **imediatamente** (sem esperar cron)
- Útil para testar envio de emails
- Mostra logs detalhados:
  - Trainers para aviso
  - Trainers para desativar
  - Tempo restante em segundos
  - Sucesso/erro de cada email
- **Não usar em produção** - é para testes

### **Rotas de Debug (backend/routes/)**

#### **GET /api/emails/test**
- Testa conexão SMTP
- Retorna status: success/error
- Útil para verificar configuração

#### **POST /api/emails/send-test**
- Envia email de teste
- Body: `{ to, subject, message }`
- Confirma que emails estão funcionando

#### **POST /api/emails/test-reminders**
- Força envio de lembretes de sessões
- Executa cron job manualmente
- Útil para testar antes de agendar para produção

---

## 📈 ROADMAP E MELHORIAS FUTURAS

### **Curto Prazo (1-2 meses)**
- [ ] Integração Stripe para pagamentos dos planos
- [ ] Webhook para ativar plano após pagamento bem-sucedido
- [ ] Admin dashboard para gerir assinaturas manualmente
- [ ] Relatórios PDF de sessões e pagamentos
- [ ] Notificações push (browser)

### **Médio Prazo (3-6 meses)**
- [ ] Upload de imagens para Cloudinary/AWS S3
- [ ] Gráficos interativos com Chart.js
- [ ] Sistema de chat em tempo real (Socket.io)
- [ ] Planos de treino detalhados (exercícios, séries, reps)
- [ ] Tracking de progresso do cliente (peso, medidas)
- [ ] Calendário visual interativo

### **Longo Prazo (6-12 meses)**
- [ ] App mobile (React Native)
- [ ] Integração com wearables (Apple Health, Google Fit)
- [ ] Marketplace de trainers (descoberta)
- [ ] Sistema de reviews públicos
- [ ] Blog integrado para SEO
- [ ] Multi-idioma (i18n)

---

## 🔥 CHANGELOG - ÚLTIMA ATUALIZAÇÃO

### **Versão 2.0.0 - 02/12/2025**

#### **🌟 Novidades Principais**:

1. **Landing Page Profissional**
   - 7 seções completas (Hero, Features, Demo, Pricing, Testimonials, CTA, Footer)
   - 3 planos de preços (Basic €15, Pro €30, Premium €50)
   - Design glassmorphism premium
   - Roteamento para `/register` com plano selecionado

2. **Sistema de Trial de 14 Dias**
   - Criação automática ao registar como trainer
   - 5 novos campos no User model
   - Verificação no login (bloqueia se expirado)
   - Página `/trial-expired` com opções de upgrade

3. **Auto-Logout Multi-Camadas**
   - Check local a cada 1 segundo
   - Check servidor a cada 3 segundos
   - Interceptor em todas as responses
   - Listener de visibilitychange
   - Logout + redirect automático

4. **Cron Job de Trials**
   - Roda diariamente às 10:00 AM
   - Email de aviso no dia 13
   - Email de expiração + desativação no dia 14
   - Logs detalhados no console

5. **Emails de Trial**
   - `sendTrialWarningEmail`: Gradiente laranja, countdown
   - `sendTrialExpiredEmail`: Gradiente vermelho, CTA de upgrade
   - Templates HTML responsivos

6. **Sistema de Cancelamento Avançado**
   - Modal `CancellationModal.jsx` com motivo obrigatório
   - Campo `cancellation_reason` no Appointment
   - Email ao trainer com todos os detalhes:
     - Nome, email, telefone do cliente
     - Data/hora da sessão cancelada
     - Motivo completo
   - Permissões: Clientes podem cancelar suas próprias sessões

7. **Endpoint de Perfil de Cliente**
   - `GET /api/auth/user/:id`
   - Trainers veem perfil completo de clientes associados
   - Validação de permissões (só clientes do trainer)

8. **Correções**
   - Formulário de agendamento agora inclui `associatedClients`
   - ClientProfileSection usa endpoint correto
   - Logs de debug para troubleshooting

#### **📁 Arquivos Novos**:
- `frontend/src/components/LandingPage.jsx` (285 linhas)
- `frontend/src/components/TrialExpired.jsx` (266 linhas)
- `frontend/src/components/CancellationModal.jsx` (95 linhas)
- `backend/services/trialCheckScheduler.js` (81 linhas)
- `backend/middleware/checkTrialStatus.js` (48 linhas)
- `backend/check-trials.js` (50 linhas)
- `backend/fix-existing-trainers.js` (55 linhas)
- `backend/force-trial-check.js` (118 linhas)

#### **📝 Arquivos Modificados**:
- `backend/models/User.js` - Adicionados 5 campos de trial
- `backend/models/Appointment.js` - Adicionado `cancellation_reason`
- `backend/routes/authRoutes.js` - Trial logic + endpoint `/user/:id`
- `backend/routes/appointmentRoutes.js` - Permissões de cliente + email de cancelamento
- `backend/utils/emailService.js` - 3 novos templates de email
- `backend/index.js` - Inicia trial scheduler
- `frontend/src/main.jsx` - Rotas `/` e `/trial-expired`
- `frontend/src/components/TrainerDashboard.jsx` - Auto-logout + lista combinada
- `frontend/src/components/ClientDashboard.jsx` - Modal de cancelamento
- `frontend/src/components/Login.jsx` - Redirect se trial expirado
- `frontend/src/components/ClientProfileSection.jsx` - Endpoint atualizado

#### **🐛 Bugs Corrigidos**:
- Clientes não apareciam no formulário de agendamento
- Botão "Ver" não mostrava perfil do cliente
- Spread operator falhava ao criar trial no registo
- Backend não reiniciava com código antigo

---

**Desenvolvido com ❤️ usando Node.js, React e MongoDB**

**Última atualização**: 02/12/2025  
**Versão**: 2.0.0  
**Status**: ✅ Produção Ready (exceto pagamentos online)
