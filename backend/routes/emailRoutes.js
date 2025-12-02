import express from "express";
import auth from "../middleware/authMiddleware.js";
import { sendTestReminders } from "../utils/reminderScheduler.js";
import transporter from "../utils/emailService.js";

const router = express.Router();

// Testar configuração de email
router.get("/test", auth, async (req, res) => {
  try {
    // Verificar se está configurado
    if (!process.env.EMAIL_USER) {
      return res.status(400).json({ 
        msg: "Email não configurado", 
        instructions: "Configure EMAIL_USER e EMAIL_PASS no arquivo .env" 
      });
    }

    // Testar conexão
    await transporter.verify();
    
    res.json({ 
      msg: "✅ Servidor de email configurado corretamente",
      from: process.env.EMAIL_USER,
      host: process.env.EMAIL_HOST
    });
  } catch (error) {
    res.status(500).json({ 
      msg: "❌ Erro na configuração de email", 
      error: error.message,
      instructions: "Verifique as credenciais no .env (use senha de aplicação do Gmail)"
    });
  }
});

// Enviar email de teste
router.post("/send-test", auth, async (req, res) => {
  try {
    const { to } = req.body;
    
    if (!to) {
      return res.status(400).json({ msg: "Email destinatário não fornecido" });
    }

    await transporter.sendMail({
      from: `"MyFitness Test" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "🧪 Email de Teste - MyFitness",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #00ffaa;">✅ Sistema de Emails Funcional!</h2>
            <p>Este é um email de teste da plataforma MyFitness.</p>
            <p>Se recebeste este email, significa que o sistema está configurado corretamente! 🎉</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">Enviado em: ${new Date().toLocaleString("pt-PT")}</p>
          </div>
        </div>
      `
    });

    res.json({ msg: "✅ Email de teste enviado com sucesso para " + to });
  } catch (error) {
    res.status(500).json({ msg: "❌ Erro ao enviar email", error: error.message });
  }
});

// Executar lembretes manualmente
router.post("/test-reminders", auth, async (req, res) => {
  try {
    await sendTestReminders();
    res.json({ msg: "✅ Teste de lembretes executado (verifique console do servidor)" });
  } catch (error) {
    res.status(500).json({ msg: "❌ Erro ao testar lembretes", error: error.message });
  }
});

// Estatísticas de emails enviados (futuro: integrar com banco)
router.get("/stats", auth, async (req, res) => {
  res.json({
    msg: "Funcionalidade em desenvolvimento",
    note: "Aqui serão exibidas estatísticas de emails enviados, taxa de abertura, etc."
  });
});

export default router;
