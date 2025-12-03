import { useNavigate } from 'react-router-dom';

function TrialExpired() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Básico',
      price: '15',
      clientLimit: 'Até 10 clientes',
      features: [
        '✅ Dashboard com estatísticas',
        '✅ Gestão de clientes',
        '✅ Agendamentos ilimitados',
        '✅ Notificações por email',
        '✅ Perfil profissional',
        '❌ Pacotes de treino',
        '❌ Estatísticas avançadas'
      ],
      id: 'basic'
    },
    {
      name: 'Pro',
      price: '25',
      clientLimit: 'Até 30 clientes',
      features: [
        '✅ Tudo do Básico',
        '✅ Pacotes de treino',
        '✅ Gestão de pagamentos',
        '✅ Estatísticas detalhadas (6 meses)',
        '✅ Sistema de avaliações',
        '✅ Emails automáticos (6 tipos)',
        '✅ Suporte prioritário'
      ],
      popular: true,
      id: 'pro'
    },
    {
      name: 'Premium',
      price: '40',
      clientLimit: 'Clientes ilimitados',
      features: [
        '✅ Tudo do Pro',
        '✅ Upload de vídeos de treino',
        '✅ Chat em tempo real',
        '✅ Analytics avançados',
        '✅ Suporte prioritário 24/7',
        '✅ Marca personalizada',
        '✅ API de integração'
      ],
      id: 'premium'
    }
  ];

  const handleUpgrade = async (planId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Por favor, faz login primeiro.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/subscription/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Erro ao processar pagamento");
      }
    } catch (error) {
      alert("Erro ao processar pagamento");
    }
  };

  const handleBack = () => {
    localStorage.clear();
    navigate('/');
  };

  const checkServerConfig = async () => {
    try {
      const res = await fetch('https://myfitness-pkft.onrender.com/api/debug/check-env');
      const data = await res.json();
      
      const missingVars = Object.entries(data.environment)
        .filter(([key, value]) => value.includes('❌'))
        .map(([key]) => key);
      
      if (missingVars.length > 0) {
        alert(`⚠️ Variáveis em falta:\n\n${missingVars.join('\n')}`);
      } else {
        alert('✅ Configuração OK!');
      }
    } catch (error) {
      alert('Erro ao verificar configuração');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            ⏰
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ff9900 0%, #ff6600 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Período Experimental Expirado
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            O teu trial de 14 dias terminou. Escolhe um plano para continuar a usar o MyFitness!
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          background: 'rgba(255,153,0,0.1)',
          border: '2px solid rgba(255,153,0,0.3)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '50px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#ff9900' }}>
            🔒 Conta Suspensa Temporariamente
          </h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
            Não te preocupes! <strong>Os teus dados estão seguros</strong> e serão restaurados assim que
            fizeres upgrade para um plano pago. Todos os teus clientes, agendamentos e histórico
            ficam guardados.
          </p>
        </div>

        {/* Plans */}
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '40px',
          background: 'linear-gradient(135deg, #dc143c 0%, #8b0000 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Escolhe o teu plano
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: plan.popular 
                  ? 'linear-gradient(135deg, rgba(0,255,170,0.1) 0%, rgba(69,121,245,0.1) 100%)' 
                  : 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: plan.popular ? '2px solid #dc143c' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '40px',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #dc143c 0%, #b22222 100%)',
                  color: '#0a0a0a',
                  padding: '8px 24px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 20px rgba(0,255,170,0.4)'
                }}>
                  ⭐ MAIS POPULAR
                </div>
              )}

              <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
                {plan.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '10px' }}>
                <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc143c' }}>
                  €{plan.price}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '8px' }}>
                  /mês
                </span>
              </div>
              <div style={{
                background: 'rgba(0,255,170,0.1)',
                border: '1px solid rgba(0,255,170,0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                display: 'inline-block',
                color: '#dc143c',
                fontSize: '14px',
                marginBottom: '30px'
              }}>
                {plan.clientLimit}
              </div>

              <div style={{ marginBottom: '30px' }}>
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 0',
                      borderBottom: idx < plan.features.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      color: feature.startsWith('✅') ? '#fff' : 'rgba(255,255,255,0.4)',
                      fontSize: '15px'
                    }}
                  >
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: plan.popular
                    ? 'linear-gradient(135deg, #dc143c 0%, #b22222 100%)'
                    : 'rgba(255,255,255,0.1)',
                  border: plan.popular ? 'none' : '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: plan.popular ? '#0a0a0a' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  if (!plan.popular) {
                    e.target.style.background = 'rgba(255,255,255,0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  if (!plan.popular) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
              >
                💳 PAGAR E ATIVAR AGORA
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
            <button
              onClick={checkServerConfig}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                background: 'rgba(220, 20, 60, 0.1)',
                border: '1px solid rgba(220, 20, 60, 0.3)',
                borderRadius: '8px',
                color: '#dc143c',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(220, 20, 60, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(220, 20, 60, 0.1)';
              }}
            >
              🔧 Verificar Configuração
            </button>

            <button
              onClick={handleBack}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              ← Voltar ao Início
            </button>
          </div>

          <p style={{
            marginTop: '30px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px'
          }}>
            Tens dúvidas? Contacta-nos: <a href="mailto:suporte@myfitness.com" style={{ color: '#dc143c' }}>suporte@myfitness.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrialExpired;

