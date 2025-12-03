import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuração do transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Template de email base
const emailTemplate = (content, title) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 255, 170, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #00ffaa 0%, #4579f5 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: white;
      font-size: 28px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    .content {
      padding: 40px 30px;
      color: #333;
      line-height: 1.8;
    }
    .highlight {
      background: linear-gradient(135deg, rgba(0, 255, 170, 0.2), rgba(69, 121, 245, 0.2));
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      border-left: 4px solid #00ffaa;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #00ffaa, #4579f5);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin-top: 20px;
      box-shadow: 0 4px 15px rgba(0, 255, 170, 0.4);
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .info-row {
      margin: 12px 0;
      padding: 10px;
      background: rgba(0, 255, 170, 0.05);
      border-radius: 6px;
    }
    .label {
      font-weight: bold;
      color: #00ffaa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💪 ${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>MyFitness - Personal Training Platform</p>
      <p style="font-size: 12px; margin-top: 10px;">
        Este é um email automático, não responda diretamente.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Email quando cliente é associado a trainer
export const sendClientWelcomeEmail = async (clientEmail, clientName, trainer) => {
  const content = `
    <h2>Bem-vindo(a), ${clientName}! 🎉</h2>
    <p>Ficamos felizes em informar que foste associado(a) ao teu Personal Trainer!</p>
    
    <div class="highlight">
      <h3>📋 Informações do Teu Trainer:</h3>
      <div class="info-row">
        <span class="label">Nome:</span> ${trainer.name}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> ${trainer.email}
      </div>
      ${trainer.phone ? `
        <div class="info-row">
          <span class="label">Telemóvel:</span> ${trainer.phone}
        </div>
      ` : ''}
      ${trainer.city ? `
        <div class="info-row">
          <span class="label">Cidade:</span> ${trainer.city}
        </div>
      ` : ''}
      ${trainer.specialties && trainer.specialties.length > 0 ? `
        <div class="info-row">
          <span class="label">Especialidades:</span> ${trainer.specialties.join(', ')}
        </div>
      ` : ''}
      ${trainer.price_per_session > 0 ? `
        <div class="info-row">
          <span class="label">Preço por Sessão:</span> ${trainer.price_per_session}€
        </div>
      ` : ''}
    </div>

    ${trainer.bio ? `
      <p><strong>Sobre o teu Trainer:</strong></p>
      <p style="font-style: italic; color: #666;">${trainer.bio}</p>
    ` : ''}

    <p style="margin-top: 30px;">
      <strong>Próximos Passos:</strong>
    </p>
    <ul>
      <li>Entra na plataforma para ver a tua área de cliente</li>
      <li>Consulta os pacotes disponíveis</li>
      <li>Agenda a tua primeira sessão</li>
      <li>Mantém-te atualizado sobre as tuas sessões</li>
    </ul>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
      Aceder à Plataforma 🚀
    </a>

    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      Em caso de dúvidas, contacta diretamente o teu trainer através dos contactos acima.
    </p>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `🎉 Bem-vindo! Foste associado a ${trainer.name}`,
    html: emailTemplate(content, "Novo Personal Trainer"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro email boas-vindas:`, error.message);
  }
};

// Email quando trainer adiciona cliente
export const sendTrainerNotification = async (trainerEmail, trainerName, clientName, clientEmail) => {
  const content = `
    <h2>Novo Cliente Adicionado! 🎉</h2>
    <p>Olá ${trainerName},</p>
    <p>Informamos que adicionaste um novo cliente à tua lista!</p>
    
    <div class="highlight">
      <h3>📋 Informações do Cliente:</h3>
      <div class="info-row">
        <span class="label">Nome:</span> ${clientName}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> ${clientEmail}
      </div>
    </div>

    <p><strong>O cliente recebeu um email automático</strong> com as tuas informações e instruções para começar.</p>

    <p style="margin-top: 20px;">
      <strong>Sugestões:</strong>
    </p>
    <ul>
      <li>Contacta o cliente para agendar a primeira sessão</li>
      <li>Discute objetivos e necessidades específicas</li>
      <li>Define um plano de treino personalizado</li>
      <li>Apresenta os pacotes disponíveis</li>
    </ul>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
      Ver Dashboard 📊
    </a>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: trainerEmail,
    subject: `✅ Novo Cliente: ${clientName}`,
    html: emailTemplate(content, "Novo Cliente Adicionado"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro notificação trainer:`, error.message);
  }
};

// Email de lembrete de sessão (24h antes)
export const sendAppointmentReminder = async (clientEmail, clientName, appointment, trainer) => {
  const appointmentDate = new Date(appointment.start_datetime);
  const formattedDate = appointmentDate.toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <h2>Lembrete de Sessão! ⏰</h2>
    <p>Olá ${clientName},</p>
    <p>Este é um lembrete da tua sessão agendada para amanhã!</p>
    
    <div class="highlight">
      <h3>📅 Detalhes da Sessão:</h3>
      <div class="info-row">
        <span class="label">Data:</span> ${formattedDate}
      </div>
      <div class="info-row">
        <span class="label">Hora:</span> ${formattedTime}
      </div>
      <div class="info-row">
        <span class="label">Trainer:</span> ${trainer.name}
      </div>
      ${trainer.phone ? `
        <div class="info-row">
          <span class="label">Contacto:</span> ${trainer.phone}
        </div>
      ` : ''}
      ${appointment.notes ? `
        <div class="info-row">
          <span class="label">Notas:</span> ${appointment.notes}
        </div>
      ` : ''}
    </div>

    <p><strong>⚠️ Importante:</strong></p>
    <ul>
      <li>Chega 5-10 minutos antes</li>
      <li>Traz roupa e calçado adequado</li>
      <li>Hidrata-te bem antes da sessão</li>
      <li>Em caso de imprevisto, contacta o teu trainer</li>
    </ul>

    <p style="margin-top: 20px;">Precisa cancelar?</p>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
      Gerir Sessões 📱
    </a>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `⏰ Lembrete: Sessão amanhã às ${formattedTime}`,
    html: emailTemplate(content, "Lembrete de Sessão"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro lembrete:`, error.message);
  }
};

// Email quando sessão é agendada
export const sendAppointmentConfirmation = async (clientEmail, clientName, appointment, trainer) => {
  const appointmentDate = new Date(appointment.start_datetime);
  const formattedDate = appointmentDate.toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <h2>Sessão Confirmada! ✅</h2>
    <p>Olá ${clientName},</p>
    <p>A tua sessão foi agendada com sucesso!</p>
    
    <div class="highlight">
      <h3>📅 Detalhes da Sessão:</h3>
      <div class="info-row">
        <span class="label">Data:</span> ${formattedDate}
      </div>
      <div class="info-row">
        <span class="label">Hora:</span> ${formattedTime}
      </div>
      <div class="info-row">
        <span class="label">Trainer:</span> ${trainer.name}
      </div>
      ${trainer.phone ? `
        <div class="info-row">
          <span class="label">Contacto:</span> ${trainer.phone}
        </div>
      ` : ''}
    </div>

    <p>Receberás um lembrete 24 horas antes da sessão.</p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
      Ver Minhas Sessões 📱
    </a>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `✅ Sessão Confirmada - ${formattedDate}`,
    html: emailTemplate(content, "Sessão Agendada"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro confirmação:`, error.message);
  }
};

// Email quando sessão é cancelada
export const sendCancellationEmail = async (clientEmail, clientName, appointment, trainer) => {
  const appointmentDate = new Date(appointment.start_datetime);
  const formattedDate = appointmentDate.toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <h2>Sessão Cancelada ❌</h2>
    <p>Olá ${clientName},</p>
    <p>Informamos que a sessão foi cancelada.</p>
    
    <div class="highlight">
      <h3>📅 Sessão Cancelada:</h3>
      <div class="info-row">
        <span class="label">Data:</span> ${formattedDate}
      </div>
      <div class="info-row">
        <span class="label">Hora:</span> ${formattedTime}
      </div>
      <div class="info-row">
        <span class="label">Trainer:</span> ${trainer.name}
      </div>
    </div>

    <p>Para reagendar ou para qualquer questão, contacta o teu trainer:</p>
    <p>📧 ${trainer.email}${trainer.phone ? ` | 📱 ${trainer.phone}` : ''}</p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
      Agendar Nova Sessão 📅
    </a>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `❌ Sessão Cancelada - ${formattedDate}`,
    html: emailTemplate(content, "Cancelamento"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro ao enviar email:`, error);
  }
};

// Email ao trainer quando cliente cancela sessão
export const sendClientCancellationNotification = async (trainerEmail, trainerName, appointment, client, cancellationReason) => {
  console.log("🔧 sendClientCancellationNotification chamada:", {
    trainerEmail,
    trainerName,
    clientName: appointment.client_name,
    cancellationReason
  });

  const appointmentDate = new Date(appointment.start_datetime);
  const formattedDate = appointmentDate.toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `
    <h2>Cliente Cancelou Sessão ⚠️</h2>
    <p>Olá ${trainerName},</p>
    <p>Informamos que o cliente <strong>${appointment.client_name}</strong> cancelou a sessão agendada.</p>
    
    <div class="highlight">
      <h3>👤 Dados do Cliente:</h3>
      <div class="info-row">
        <span class="label">Nome:</span> ${appointment.client_name}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> ${appointment.client_email}
      </div>
      ${appointment.client_phone ? `
        <div class="info-row">
          <span class="label">Telemóvel:</span> ${appointment.client_phone}
        </div>
      ` : ''}
    </div>

    <div class="highlight" style="margin-top: 20px;">
      <h3>📅 Sessão Cancelada:</h3>
      <div class="info-row">
        <span class="label">Data:</span> ${formattedDate}
      </div>
      <div class="info-row">
        <span class="label">Hora:</span> ${formattedTime}
      </div>
    </div>

    <div style="margin: 25px 0; padding: 20px; background: rgba(255, 193, 7, 0.1); border-left: 4px solid #ffc107; border-radius: 8px;">
      <p style="margin: 0; color: #000; font-weight: bold; margin-bottom: 8px;">💬 Motivo do Cancelamento:</p>
      <p style="margin: 0; color: #333; line-height: 1.6;">${cancellationReason}</p>
    </div>

    <p>Podes contactar o cliente para reagendar ou esclarecer qualquer questão.</p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
      Ver Dashboard 📊
    </a>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: trainerEmail,
    subject: `⚠️ Cancelamento: ${appointment.client_name} - ${formattedDate}`,
    html: emailTemplate(content, "Notificação de Cancelamento"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro ao enviar email:`, error);
  }
};

// Email após sessão concluída (com notas do trainer)
export const sendSessionCompletedEmail = async (clientEmail, clientName, appointment, trainer) => {
  const appointmentDate = new Date(appointment.start_datetime);
  const formattedDate = appointmentDate.toLocaleDateString("pt-PT");

  const content = `
    <h2>Sessão Concluída! 💪</h2>
    <p>Olá ${clientName},</p>
    <p>Parabéns por completares mais uma sessão!</p>
    
    <div class="highlight">
      <h3>📅 Sessão:</h3>
      <div class="info-row">
        <span class="label">Data:</span> ${formattedDate}
      </div>
      <div class="info-row">
        <span class="label">Trainer:</span> ${trainer.name}
      </div>
      ${appointment.workout_notes ? `
        <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px;">
          <p style="margin: 0; color: #00ffaa; font-weight: bold;">📝 Notas do Trainer:</p>
          <p style="margin: 10px 0 0 0; color: #333;">${appointment.workout_notes}</p>
        </div>
      ` : ''}
    </div>

    <p><strong>Não te esqueças de avaliar a sessão!</strong></p>
    <p>O teu feedback ajuda-nos a melhorar continuamente o serviço.</p>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">
      Avaliar Sessão ⭐
    </a>

    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      Continua a trabalhar duro e os resultados vão aparecer! 💪
    </p>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: clientEmail,
    subject: `💪 Sessão Concluída - ${formattedDate}`,
    html: emailTemplate(content, "Sessão Concluída"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro ao enviar email:`, error);
  }
};

// Email de aviso de trial (falta 1 dia)
export const sendTrialWarningEmail = async (trainer) => {
  const trialEndDate = new Date(trainer.trial_end_date);
  const formattedDate = trialEndDate.toLocaleDateString("pt-PT");
  const formattedTime = trialEndDate.toLocaleTimeString("pt-PT", { hour: '2-digit', minute: '2-digit' });

  const content = `
    <h2>⚠️ O teu período experimental está a terminar!</h2>
    <p>Olá ${trainer.name},</p>
    <p>Este é um lembrete de que o teu <strong>período experimental de 14 dias</strong> está quase a terminar.</p>
    
    <div class="highlight" style="background: linear-gradient(135deg, rgba(255,170,0,0.1), rgba(255,100,0,0.1)); border-left: 4px solid #ff9900;">
      <h3>⏰ Expira em:</h3>
      <div class="info-row">
        <span class="label">Data:</span> ${formattedDate}
      </div>
      <div class="info-row">
        <span class="label">Hora:</span> ${formattedTime}
      </div>
      <div style="margin-top: 15px; padding: 12px; background: white; border-radius: 8px;">
        <p style="margin: 0; color: #ff9900; font-weight: bold; font-size: 18px;">
          ⏳ Resta apenas 1 dia!
        </p>
      </div>
    </div>

    <p><strong>O que acontece quando o trial expirar?</strong></p>
    <ul style="line-height: 1.8;">
      <li>❌ Não poderás fazer login na plataforma</li>
      <li>❌ Perdes acesso a todas as funcionalidades</li>
      <li>✅ Os teus dados ficam guardados em segurança</li>
    </ul>

    <p><strong>Continua a usar o MyFitness escolhendo um plano:</strong></p>
    <div style="margin: 20px 0; padding: 15px; background: rgba(0,255,170,0.05); border-radius: 8px;">
      <p style="margin: 0; font-size: 14px;">
        📦 <strong>Básico</strong> - €15/mês (até 20 clientes)<br/>
        ⭐ <strong>Pro</strong> - €30/mês (clientes ilimitados)<br/>
        💎 <strong>Premium</strong> - €50/mês (todas as funcionalidades)
      </p>
    </div>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button" style="background: linear-gradient(135deg, #ff9900, #ff6600);">
      Fazer Upgrade Agora 🚀
    </a>

    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      Tens alguma dúvida? Responde a este email e teremos todo o prazer em ajudar! 💪
    </p>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: trainer.email,
    subject: `⚠️ O teu trial expira amanhã - MyFitness`,
    html: emailTemplate(content, "Trial a Expirar"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro ao enviar email de aviso:`, error);
    throw error;
  }
};

// Email de trial expirado
export const sendTrialExpiredEmail = async (trainer) => {
  const trialEndDate = new Date(trainer.trial_end_date);
  const formattedDate = trialEndDate.toLocaleDateString("pt-PT");

  const content = `
    <h2>🚫 O teu período experimental expirou</h2>
    <p>Olá ${trainer.name},</p>
    <p>O teu período experimental de 14 dias terminou em <strong>${formattedDate}</strong>.</p>
    
    <div class="highlight" style="background: linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,100,100,0.1)); border-left: 4px solid #ff3333;">
      <h3>⛔ Conta Suspensa</h3>
      <p style="margin: 10px 0;">A tua conta foi temporariamente suspensa porque o período experimental terminou.</p>
      <div style="margin-top: 15px; padding: 12px; background: white; border-radius: 8px;">
        <p style="margin: 0; color: #ff3333; font-weight: bold;">
          Não te preocupes! Os teus dados estão seguros.
        </p>
      </div>
    </div>

    <p><strong>Como reativar a tua conta?</strong></p>
    <p>É simples! Basta escolher um dos nossos planos e fazer upgrade:</p>

    <div style="margin: 20px 0;">
      <div style="padding: 15px; background: rgba(0,255,170,0.05); border-radius: 8px; margin-bottom: 10px;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #00ffaa;">📦 Plano Básico - €15/mês</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Até 20 clientes • Dashboard • Agendamentos</p>
      </div>
      <div style="padding: 15px; background: rgba(69,121,245,0.05); border-radius: 8px; margin-bottom: 10px; border: 2px solid #4579f5;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #4579f5;">⭐ Plano Pro - €30/mês (Recomendado)</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Clientes ilimitados • Pacotes • Estatísticas • Emails</p>
      </div>
      <div style="padding: 15px; background: rgba(138,43,226,0.05); border-radius: 8px;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #8a2be2;">💎 Plano Premium - €50/mês</p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Tudo do Pro + Upload vídeos • Chat • Analytics</p>
      </div>
    </div>

    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">
      Reativar Conta Agora 🚀
    </a>

    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      Depois do upgrade, terás acesso imediato a todas as funcionalidades da plataforma! 💪
    </p>

    <p style="margin-top: 20px; color: #999; font-size: 13px;">
      Alguma dúvida? Responde a este email ou contacta-nos diretamente.
    </p>
  `;

  const mailOptions = {
    from: `"MyFitness Platform" <${process.env.EMAIL_USER}>`,
    to: trainer.email,
    subject: `🚫 Período experimental expirado - Faz upgrade agora`,
    html: emailTemplate(content, "Trial Expirado"),
  };

  try {
    await transporter.sendMail(mailOptions);
    // Email enviado
  } catch (error) {
    console.error(`❌ Erro ao enviar email de expiração:`, error);
    throw error;
  }
};

export default transporter;
