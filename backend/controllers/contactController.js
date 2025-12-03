import nodemailer from 'nodemailer';

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validação básica
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // TODO: Configurar nodemailer com credenciais reais em produção
    // const transporter = nodemailer.createTransporter({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    // });

    // const mailOptions = {
    //   from: email,
    //   to: 'support@myfitness.pt',
    //   subject: `[MyFitness Contact] ${subject}`,
    //   html: `
    //     <h3>Nova mensagem de contacto</h3>
    //     <p><strong>Nome:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Assunto:</strong> ${subject}</p>
    //     <p><strong>Mensagem:</strong></p>
    //     <p>${message}</p>
    //   `
    // };

    // await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao processar mensagem de contacto:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};
