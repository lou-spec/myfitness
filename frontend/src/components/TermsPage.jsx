import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function TermsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="app-container">
      {user && <Navbar user={user} setUser={setUser} />}

      <div className="legal-page">
        <div className="legal-container">
          <h1>📄 Termos de Uso</h1>
          <p className="last-updated">Última atualização: 3 de Dezembro de 2025</p>

          <section>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao aceder e utilizar a plataforma MyFitness, concordas em ficar vinculado a estes Termos de Uso. Se não concordas com qualquer parte destes termos, não deves utilizar os nossos serviços.
            </p>
          </section>

          <section>
            <h2>2. Descrição do Serviço</h2>
            <p>
              O MyFitness é uma plataforma de gestão para personal trainers que permite:
            </p>
            <ul>
              <li>Gestão de clientes e agendamentos</li>
              <li>Acompanhamento de treinos e progresso</li>
              <li>Sistema de pagamentos e faturas</li>
              <li>Criação de pacotes de treino personalizados</li>
            </ul>
          </section>

          <section>
            <h2>3. Conta de Utilizador</h2>
            <p>
              <strong>Registo:</strong> Para utilizar o MyFitness, deves criar uma conta fornecendo informações precisas e completas.
            </p>
            <p>
              <strong>Segurança:</strong> És responsável por manter a confidencialidade da tua conta e password. Qualquer atividade que ocorra na tua conta é da tua responsabilidade.
            </p>
            <p>
              <strong>Uso Adequado:</strong> Concordas em não utilizar a plataforma para fins ilegais ou não autorizados.
            </p>
          </section>

          <section>
            <h2>4. Planos e Pagamentos</h2>
            <p>
              <strong>Período de Teste:</strong> Oferecemos um período de teste gratuito de 14 dias para novos trainers.
            </p>
            <p>
              <strong>Subscrições:</strong> Após o período de teste, o acesso à plataforma requer uma subscrição mensal paga.
            </p>
            <p>
              <strong>Renovação Automática:</strong> As subscrições são renovadas automaticamente a cada mês até cancelamento.
            </p>
            <p>
              <strong>Reembolsos:</strong> Não oferecemos reembolsos por pagamentos já processados, exceto conforme exigido por lei.
            </p>
          </section>

          <section>
            <h2>5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponível na plataforma MyFitness, incluindo textos, gráficos, logos, ícones e software, é propriedade da MyFitness ou dos seus fornecedores de conteúdo e está protegido por leis de direitos autorais.
            </p>
          </section>

          <section>
            <h2>6. Privacidade e Dados</h2>
            <p>
              O uso dos teus dados pessoais é regido pela nossa{" "}
              <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }}>
                Política de Privacidade
              </a>
              .
            </p>
          </section>

          <section>
            <h2>7. Limitação de Responsabilidade</h2>
            <p>
              O MyFitness não se responsabiliza por:
            </p>
            <ul>
              <li>Perda de dados ou interrupções de serviço</li>
              <li>Erros ou omissões no conteúdo fornecido pelos utilizadores</li>
              <li>Danos indiretos, incidentais ou consequenciais</li>
            </ul>
          </section>

          <section>
            <h2>8. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na plataforma. O uso continuado do serviço após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2>9. Rescisão</h2>
            <p>
              Podemos suspender ou encerrar a tua conta se violares estes Termos de Uso. Podes cancelar a tua conta a qualquer momento através das configurações da plataforma.
            </p>
          </section>

          <section>
            <h2>10. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis de Portugal. Qualquer disputa será resolvida nos tribunais competentes de Portugal.
            </p>
          </section>

          <section>
            <h2>11. Contacto</h2>
            <p>
              Para questões sobre estes Termos de Uso, contacta-nos através de{" "}
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>
                nossa página de contacto
              </a>
              .
            </p>
          </section>

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

export default TermsPage;
