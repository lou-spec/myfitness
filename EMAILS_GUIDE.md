# 📧 Sistema de Notificações por Email

Sistema completo de emails automáticos para a plataforma MyFitness Personal Training.

## 🎯 Funcionalidades

### Emails Automáticos:

1. **Email de Boas-Vindas** 🎉
   - Enviado quando um cliente é associado a um trainer
   - Inclui informações completas do trainer (nome, contactos, especialidades, preço)
   - Link direto para a plataforma
   - Próximos passos para o cliente

2. **Email de Notificação para Trainer** ✅
   - Enviado ao trainer quando adiciona um novo cliente
   - Informações do cliente
   - Sugestões de próximos passos

3. **Confirmação de Agendamento** ✅
   - Enviado ao cliente quando uma sessão é agendada
   - Detalhes completos (data, hora, trainer, contactos)
   - Link para gerir sessões

4. **Lembrete de Sessão** ⏰
   - Enviado automaticamente 24h antes de cada sessão
   - Executado diariamente às 10:00 AM
   - Dicas importantes para a sessão
   - Opção de cancelamento

5. **Email de Cancelamento** ❌
   - Enviado quando uma sessão é cancelada
   - Detalhes da sessão cancelada
   - Contactos do trainer para reagendamento

6. **Email de Sessão Concluída** 💪
   - Enviado após marcar uma sessão como concluída
   - Inclui notas do trainer (se existirem)
   - Convite para avaliar a sessão

## 📝 Configuração

### 1. Instalar Dependências

As dependências já foram instaladas:
- `nodemailer` - Envio de emails
- `node-cron` - Agendamento de tarefas

### 2. Configurar Variáveis de Ambiente

Edita o ficheiro `backend/.env` e adiciona:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
FRONTEND_URL=http://localhost:5173
```

### 3. Obter Senha de App do Gmail

**IMPORTANTE:** Não uses a tua senha normal do Gmail!

#### Passos para criar uma Senha de App:

1. Vai a [https://myaccount.google.com/](https://myaccount.google.com/)
2. Clica em **Segurança** (sidebar esquerda)
3. Ativa **Verificação em 2 passos** (se ainda não estiver ativa)
4. Volta a **Segurança** → **Senhas de app**
5. Seleciona:
   - App: **Email**
   - Dispositivo: **Outro** (escreve "MyFitness")
6. Clica em **Gerar**
7. Copia a senha de 16 caracteres
8. Cola em `EMAIL_PASS` no `.env`

### 4. Outros Provedores de Email

#### **Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=seu_email@outlook.com
EMAIL_PASS=sua_senha
```

#### **Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=seu_email@yahoo.com
EMAIL_PASS=sua_senha_de_app
```

#### **SMTP Personalizado:**
```env
EMAIL_HOST=smtp.seudominio.com
EMAIL_PORT=587
EMAIL_USER=noreply@seudominio.com
EMAIL_PASS=senha_segura
```

## 🧪 Testar o Sistema

### Via Interface (Dashboard Trainer):

1. Acede à tab **📧 Notificações**
2. Clica em **🔍 Verificar Configuração**
   - Testa a conexão com o servidor SMTP
   - Valida as credenciais
3. Clica em **📧 Enviar Email de Teste**
   - Envia um email de teste para o endereço que inserires
   - Verifica se recebeste o email

### Via API (Postman/cURL):

```bash
# Testar configuração
GET http://localhost:5000/api/email/test
Authorization: Bearer SEU_TOKEN

# Enviar email de teste
POST http://localhost:5000/api/email/send-test
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "to": "email_teste@example.com"
}
```

## ⏰ Sistema de Lembretes Automáticos

### Como Funciona:

- **Scheduler:** Cron job executado diariamente às 10:00 AM
- **Lógica:** Busca sessões agendadas para o dia seguinte (status: "booked")
- **Ação:** Envia email de lembrete para cada cliente

### Personalizar Horário:

Edita `backend/utils/reminderScheduler.js`:

```javascript
// Formato: segundo minuto hora dia mês dia-da-semana
cron.schedule("0 10 * * *", async () => { // 10:00 AM diariamente
  // ... código
});

// Exemplos:
// "0 9 * * *"   - 09:00 AM todos os dias
// "0 18 * * *"  - 18:00 (6 PM) todos os dias
// "0 10 * * 1"  - 10:00 AM apenas às segundas
// "*/30 * * * *" - A cada 30 minutos
```

## 🎨 Templates de Email

Os emails usam templates HTML responsivos com:
- Design premium (gradientes, glassmorphism)
- Cores da marca (#00ffaa, #4579f5)
- Botões de ação
- Layout mobile-friendly
- Informações estruturadas

### Personalizar Templates:

Edita `backend/utils/emailService.js` → função `emailTemplate()`

## 🔒 Segurança

### Boas Práticas:

1. ✅ **Nunca commites o `.env`** no git
2. ✅ Usa **Senhas de App** em vez de senhas reais
3. ✅ Em produção, usa **variáveis de ambiente do servidor**
4. ✅ Emails são enviados de forma **assíncrona** (não bloqueia APIs)
5. ✅ Erros de email são **logados** mas não quebram a aplicação

## 🚀 Produção

### Recomendações:

1. **Use um serviço profissional:**
   - [SendGrid](https://sendgrid.com/) (100 emails/dia grátis)
   - [Mailgun](https://www.mailgun.com/) (5.000 emails/mês grátis)
   - [AWS SES](https://aws.amazon.com/ses/) (62.000 emails/mês grátis)

2. **Configure DNS:**
   - SPF, DKIM, DMARC records
   - Previne emails caírem em spam

3. **Monitorização:**
   - Taxa de entrega
   - Taxa de abertura
   - Bounces e complaints

### Exemplo SendGrid:

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.your_sendgrid_api_key_here
```

## 📊 Logs e Debugging

Os emails geram logs no console do servidor:

```
✅ Email de boas-vindas enviado para cliente@email.com
✅ Email de notificação enviado para trainer@email.com
🔔 Verificando lembretes de sessões...
📅 Encontradas 3 sessões para amanhã
✅ Lembretes enviados com sucesso!
```

Em caso de erro:

```
❌ Erro ao enviar email para cliente@email.com: Error: Invalid login
```

## 🐛 Problemas Comuns

### 1. "Invalid login" ou "Authentication failed"

**Solução:**
- Verifica se usaste uma **Senha de App** (não a senha normal)
- Confirma que a **Verificação em 2 Passos** está ativa no Gmail
- Verifica se `EMAIL_USER` e `EMAIL_PASS` estão corretos no `.env`

### 2. Emails não chegam (vão para spam)

**Solução:**
- Verifica pasta de spam/junk
- Em produção, configura SPF/DKIM records
- Usa um domínio próprio em vez de Gmail
- Usa serviços profissionais (SendGrid, Mailgun)

### 3. "ECONNREFUSED" ou "Connection timeout"

**Solução:**
- Verifica firewall/antivírus
- Confirma porta `587` ou `465`
- Testa com outros provedores (Outlook, Yahoo)
- Verifica conexão à internet

### 4. Scheduler não executa

**Solução:**
- O servidor precisa estar **sempre ligado**
- Verifica logs: `⏰ Scheduler de lembretes iniciado`
- Em produção, usa serviços como PM2, Docker, ou cloud functions

## 📚 Documentação API

### `POST /api/email/test`
Testa configuração de email.

### `POST /api/email/send-test`
Envia email de teste.

**Body:**
```json
{
  "to": "destinatario@email.com"
}
```

### `POST /api/email/test-reminders`
Executa teste manual dos lembretes.

## ✨ Próximas Melhorias

- [ ] Dashboard de analytics de emails
- [ ] Templates personalizáveis por trainer
- [ ] Suporte para SMS (Twilio)
- [ ] Emails transacionais (pagamentos)
- [ ] Newsletters para clientes
- [ ] Notificações push (PWA)

---

## 🎉 Tudo Pronto!

O sistema de emails está completo e funcional! Basta configurar o `.env` com as tuas credenciais e começar a usar.

**Documentação adicional:**
- Nodemailer: https://nodemailer.com/
- Node-cron: https://www.npmjs.com/package/node-cron
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
