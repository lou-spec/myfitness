import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function FAQPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    {
      category: "Geral",
      questions: [
        {
          q: "O que é o MyFitness?",
          a: "O MyFitness é uma plataforma completa de gestão para personal trainers. Permite gerir clientes, agendamentos, treinos, pagamentos e muito mais, tudo num único lugar."
        },
        {
          q: "Como funciona o período de teste?",
          a: "Oferecemos 14 dias de teste gratuito com acesso a todas as funcionalidades do plano Premium. Não é necessário cartão de crédito para começar."
        },
        {
          q: "Posso cancelar a qualquer momento?",
          a: "Sim! Podes cancelar a tua subscrição a qualquer momento através das configurações de pagamento. Manterás acesso até ao final do período já pago."
        }
      ]
    },
    {
      category: "Planos e Pagamentos",
      questions: [
        {
          q: "Quais são os planos disponíveis?",
          a: "Oferecemos 3 planos: Básico (€15/mês, até 10 clientes), Pro (€25/mês, até 30 clientes) e Premium (€40/mês, clientes ilimitados). Todos incluem agendamentos, treinos e relatórios."
        },
        {
          q: "Como são processados os pagamentos?",
          a: "Todos os pagamentos são processados de forma segura através do Stripe. Aceitamos cartões de crédito/débito e outros métodos de pagamento disponíveis no Stripe."
        },
        {
          q: "Posso mudar de plano durante a subscrição?",
          a: "Sim! Podes fazer upgrade ou downgrade do teu plano a qualquer momento. As alterações entram em vigor imediatamente e ajustamos o valor proporcionalmente."
        },
        {
          q: "Há reembolsos?",
          a: "Não oferecemos reembolsos, mas podes cancelar a qualquer momento e continuar a usar até ao final do período pago. Recomendamos usar o período de teste gratuito antes de subscrever."
        }
      ]
    },
    {
      category: "Funcionalidades",
      questions: [
        {
          q: "Posso gerir quantos clientes?",
          a: "Depende do teu plano: Básico permite até 10 clientes, Pro até 30 clientes e Premium não tem limite de clientes."
        },
        {
          q: "Como funciona o sistema de agendamentos?",
          a: "Podes definir a tua disponibilidade e os clientes podem marcar sessões nos horários disponíveis. Recebes notificações automáticas de novos agendamentos."
        },
        {
          q: "Posso criar planos de treino personalizados?",
          a: "Sim! Podes criar pacotes de treino personalizados para cada cliente, com exercícios, séries, repetições e notas específicas."
        },
        {
          q: "A plataforma tem app mobile?",
          a: "Atualmente a plataforma é web-based e responsiva, funcionando perfeitamente em qualquer dispositivo móvel através do navegador. Uma app nativa está planeada para o futuro."
        }
      ]
    },
    {
      category: "Segurança e Privacidade",
      questions: [
        {
          q: "Os meus dados estão seguros?",
          a: "Sim! Usamos encriptação SSL/TLS, passwords com bcrypt, autenticação JWT e seguimos as melhores práticas de segurança. Os dados são armazenados em servidores seguros MongoDB Atlas."
        },
        {
          q: "Quem tem acesso aos dados dos meus clientes?",
          a: "Apenas tu tens acesso aos dados dos teus clientes. Os dados são privados e protegidos. Consulta a nossa Política de Privacidade para mais detalhes."
        },
        {
          q: "Como posso exportar os meus dados?",
          a: "Podes solicitar uma exportação completa dos teus dados através do suporte. Fornecemos os dados em formato JSON dentro de 48 horas."
        },
        {
          q: "A plataforma está em conformidade com o RGPD?",
          a: "Sim! Cumprimos totalmente o RGPD (Regulamento Geral de Proteção de Dados) e respeitas todos os direitos dos utilizadores relativos aos seus dados pessoais."
        }
      ]
    },
    {
      category: "Suporte Técnico",
      questions: [
        {
          q: "Como posso obter suporte?",
          a: "Podes contactar-nos através do formulário de contacto, email (support@myfitness.pt) ou através do chat de suporte disponível na plataforma."
        },
        {
          q: "Qual o tempo de resposta do suporte?",
          a: "Respondemos a todas as mensagens dentro de 24 horas em dias úteis. Questões urgentes são priorizadas."
        },
        {
          q: "Há tutoriais ou documentação disponível?",
          a: "Sim! Temos uma biblioteca completa de tutoriais em vídeo e guias escritos para te ajudar a tirar o máximo partido da plataforma."
        },
        {
          q: "A plataforma está sempre disponível?",
          a: "Sim, garantimos 99.9% de uptime. Manutenções programadas são sempre comunicadas com antecedência e realizadas fora dos horários de pico."
        }
      ]
    },
    {
      category: "Conta e Configurações",
      questions: [
        {
          q: "Como altero a minha password?",
          a: "Vai a Perfil > Segurança > Alterar Password. Se esqueceste a password, usa a opção 'Esqueci a password' no login."
        },
        {
          q: "Posso ter múltiplos utilizadores/trainers na mesma conta?",
          a: "Atualmente cada trainer precisa da sua própria conta. Estamos a desenvolver funcionalidades para equipas/estúdios com múltiplos trainers."
        },
        {
          q: "Como elimino a minha conta?",
          a: "Podes eliminar a tua conta nas Configurações > Conta > Eliminar Conta. Nota que esta ação é irreversível e todos os dados serão permanentemente apagados."
        }
      ]
    }
  ];

  return (
    <div className="app-container">
      {user && <Navbar user={user} setUser={setUser} />}

      <div className="faq-page">
        <div className="faq-container">
          <h1>❓ Perguntas Frequentes (FAQ)</h1>
          <p className="faq-subtitle">
            Encontra respostas rápidas para as questões mais comuns sobre o MyFitness
          </p>

          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              
              {category.questions.map((faq, qIndex) => {
                const uniqueIndex = `${catIndex}-${qIndex}`;
                const isOpen = openQuestion === uniqueIndex;

                return (
                  <div key={uniqueIndex} className="faq-item">
                    <button
                      className={`faq-question ${isOpen ? "open" : ""}`}
                      onClick={() => toggleQuestion(uniqueIndex)}
                    >
                      <span>{faq.q}</span>
                      <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="faq-footer">
            <h3>Ainda tens dúvidas?</h3>
            <p>
              Não encontraste a resposta que procuravas? A nossa equipa está pronta para ajudar!
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="btn-contact"
            >
              📧 Contacta-nos
            </button>
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

export default FAQPage;
