import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function PrivacyPage() {
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
          <h1>🔒 Política de Privacidade</h1>
          <p className="last-updated">Última atualização: 3 de Dezembro de 2025</p>

          <section>
            <h2>1. Introdução</h2>
            <p>
              No MyFitness, levamos a tua privacidade a sério. Esta Política de Privacidade explica como recolhemos, usamos, divulgamos e protegemos as tuas informações quando utilizas a nossa plataforma.
            </p>
          </section>

          <section>
            <h2>2. Informações que Recolhemos</h2>
            
            <h3>2.1 Informações que Forneces Diretamente</h3>
            <ul>
              <li><strong>Dados de Registo:</strong> Nome, email, password, telefone</li>
              <li><strong>Dados de Perfil:</strong> Foto de perfil, especialização, biografia</li>
              <li><strong>Dados de Clientes:</strong> Nome, idade, peso, objetivos, notas de treino</li>
              <li><strong>Dados de Pagamento:</strong> Processados de forma segura através do Stripe</li>
            </ul>

            <h3>2.2 Informações Recolhidas Automaticamente</h3>
            <ul>
              <li><strong>Dados de Uso:</strong> Como utilizas a plataforma, páginas visitadas, tempo de sessão</li>
              <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, dispositivo utilizado</li>
              <li><strong>Cookies:</strong> Usamos cookies para melhorar a experiência do utilizador</li>
            </ul>
          </section>

          <section>
            <h2>3. Como Usamos as Tuas Informações</h2>
            <p>Utilizamos as informações recolhidas para:</p>
            <ul>
              <li>Fornecer e manter os nossos serviços</li>
              <li>Processar pagamentos e gestão de subscrições</li>
              <li>Personalizar a tua experiência na plataforma</li>
              <li>Enviar notificações e atualizações importantes</li>
              <li>Melhorar a segurança e prevenir fraudes</li>
              <li>Analisar e melhorar os nossos serviços</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2>4. Partilha de Informações</h2>
            <p>
              <strong>Não vendemos</strong> as tuas informações pessoais. Podemos partilhar dados apenas com:
            </p>
            <ul>
              <li><strong>Fornecedores de Serviços:</strong> Stripe (pagamentos), MongoDB Atlas (armazenamento), Render/Vercel (hosting)</li>
              <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou para proteger direitos</li>
              <li><strong>Transferências de Negócio:</strong> Em caso de fusão ou aquisição</li>
            </ul>
          </section>

          <section>
            <h2>5. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger as tuas informações:
            </p>
            <ul>
              <li>Encriptação SSL/TLS para transmissão de dados</li>
              <li>Passwords encriptadas com bcrypt</li>
              <li>Autenticação JWT com tokens seguros</li>
              <li>Backups regulares de dados</li>
              <li>Acesso restrito aos dados pessoais</li>
            </ul>
          </section>

          <section>
            <h2>6. Os Teus Direitos (RGPD)</h2>
            <p>
              Nos termos do Regulamento Geral de Proteção de Dados (RGPD), tens os seguintes direitos:
            </p>
            <ul>
              <li><strong>Acesso:</strong> Podes solicitar uma cópia dos teus dados pessoais</li>
              <li><strong>Retificação:</strong> Podes corrigir dados inexatos ou incompletos</li>
              <li><strong>Eliminação:</strong> Podes solicitar a eliminação dos teus dados ("direito ao esquecimento")</li>
              <li><strong>Portabilidade:</strong> Podes receber os teus dados num formato estruturado</li>
              <li><strong>Oposição:</strong> Podes opor-te ao processamento dos teus dados</li>
              <li><strong>Limitação:</strong> Podes solicitar a limitação do processamento</li>
            </ul>
          </section>

          <section>
            <h2>7. Retenção de Dados</h2>
            <p>
              Mantemos as tuas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, exceto se um período de retenção maior for exigido por lei.
            </p>
            <p>
              Após cancelares a tua conta, manteremos alguns dados por até 90 dias para fins de auditoria e conformidade legal.
            </p>
          </section>

          <section>
            <h2>8. Cookies e Tecnologias Semelhantes</h2>
            <p>
              Utilizamos cookies essenciais para:
            </p>
            <ul>
              <li>Manter a tua sessão ativa</li>
              <li>Lembrar as tuas preferências</li>
              <li>Analisar o uso da plataforma</li>
            </ul>
            <p>
              Podes configurar o teu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.
            </p>
          </section>

          <section>
            <h2>9. Transferências Internacionais</h2>
            <p>
              Os teus dados podem ser transferidos e processados em servidores localizados fora de Portugal/UE. Garantimos que todas as transferências cumprem os requisitos do RGPD através de cláusulas contratuais padrão.
            </p>
          </section>

          <section>
            <h2>10. Privacidade de Menores</h2>
            <p>
              A nossa plataforma não é destinada a menores de 18 anos. Não recolhemos intencionalmente dados de menores. Se tomarmos conhecimento de que recolhemos dados de um menor, eliminaremos essas informações imediatamente.
            </p>
          </section>

          <section>
            <h2>11. Alterações a Esta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através de email ou aviso na plataforma. A data da última atualização é sempre indicada no topo desta página.
            </p>
          </section>

          <section>
            <h2>12. Contacto</h2>
            <p>
              Para exercer os teus direitos ou esclarecer dúvidas sobre privacidade, contacta-nos através de:
            </p>
            <ul>
              <li>Email: privacy@myfitness.pt</li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>
                  Formulário de Contacto
                </a>
              </li>
            </ul>
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

export default PrivacyPage;
