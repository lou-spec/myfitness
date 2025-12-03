import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function ContactPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Preenche automaticamente nome e email se o utilizador está logado
      setFormData(prev => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://myfitness-pkft.onrender.com";
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({
          type: "success",
          message: "✅ Mensagem enviada com sucesso! Responderemos em breve."
        });
        // Limpa apenas o assunto e mensagem, mantém nome e email
        setFormData(prev => ({
          ...prev,
          subject: "",
          message: ""
        }));
      } else {
        throw new Error("Erro ao enviar mensagem");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setStatus({
        type: "error",
        message: "❌ Erro ao enviar mensagem. Por favor, tenta novamente ou envia email direto para support@myfitness.pt"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {user && <Navbar user={user} setUser={setUser} />}

      <div className="contact-page">
        <div className="contact-container">
          <h1>📧 Contacta-nos</h1>
          <p className="contact-subtitle">
            Tens alguma questão, sugestão ou precisas de ajuda? Estamos aqui para ti!
          </p>

          <div className="contact-content">
            {/* Formulário de Contacto */}
            <div className="contact-form-section">
              <h2>Envia-nos uma Mensagem</h2>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Nome *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="O teu nome"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="o-teu-email@exemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Assunto *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleciona um assunto</option>
                    <option value="suporte-tecnico">Suporte Técnico</option>
                    <option value="pagamentos">Questões sobre Pagamentos</option>
                    <option value="funcionalidades">Sugestão de Funcionalidade</option>
                    <option value="bug">Reportar Bug</option>
                    <option value="conta">Questões sobre Conta</option>
                    <option value="parceria">Proposta de Parceria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensagem *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Descreve em detalhe a tua questão ou mensagem..."
                  />
                </div>

                {status.message && (
                  <div className={`status-message ${status.type}`}>
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "A enviar..." : "Enviar Mensagem"}
                </button>
              </form>
            </div>

            {/* Informações de Contacto Alternativas */}
            <div className="contact-info-section">
              <h2>Outras Formas de Contacto</h2>

              <div className="contact-method">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h3>Email Direto</h3>
                  <p>support@myfitness.pt</p>
                  <span className="contact-note">Resposta em até 24 horas</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">💬</div>
                <div className="contact-details">
                  <h3>Chat de Suporte</h3>
                  <p>Disponível na plataforma</p>
                  <span className="contact-note">Segunda a Sexta, 9h-18h</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">📱</div>
                <div className="contact-details">
                  <h3>Redes Sociais</h3>
                  <p>@MyFitnessPortugal</p>
                  <span className="contact-note">Instagram, Facebook, LinkedIn</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="contact-icon">❓</div>
                <div className="contact-details">
                  <h3>FAQ</h3>
                  <p>
                    <a href="/faq" onClick={(e) => { e.preventDefault(); navigate("/faq"); }}>
                      Consulta as perguntas frequentes
                    </a>
                  </p>
                  <span className="contact-note">Respostas rápidas às questões comuns</span>
                </div>
              </div>

              <div className="business-hours">
                <h3>Horário de Atendimento</h3>
                <ul>
                  <li><strong>Segunda a Sexta:</strong> 9h00 - 18h00</li>
                  <li><strong>Sábado:</strong> 10h00 - 14h00</li>
                  <li><strong>Domingo:</strong> Fechado</li>
                </ul>
                <p className="note">
                  * Fora do horário de atendimento, podes enviar mensagem e responderemos no próximo dia útil.
                </p>
              </div>
            </div>
          </div>

          <div className="back-button-container">
            <button onClick={() => navigate(-1)} className="btn-back">
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
