import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const features = [
    {
      icon: '⏱️',
      title: 'Economize Tempo',
      description: 'Sistema de agendamento automático com lembretes por email 24h antes de cada sessão'
    },
    {
      icon: '💰',
      title: 'Controle Financeiro',
      description: 'Gestão completa de pagamentos com estatísticas dos últimos 6 meses e métodos variados'
    },
    {
      icon: '📦',
      title: 'Pacotes de Treino',
      description: 'Crie e venda pacotes personalizados de treino para seus clientes de forma profissional'
    },
    {
      icon: '📧',
      title: 'Emails Automáticos',
      description: 'Sistema completo com 6 tipos de emails: confirmação, lembretes, cancelamento e conclusão'
    },
    {
      icon: '👥',
      title: 'Gestão de Clientes',
      description: 'Associe clientes, acompanhe histórico de sessões, notas de treino e avaliações'
    },
    {
      icon: '📊',
      title: 'Dashboard Completo',
      description: 'Visualize estatísticas em tempo real: receita, clientes, agendamentos e próximas sessões'
    },
    {
      icon: '⭐',
      title: 'Sistema de Avaliações',
      description: 'Clientes podem avaliar sessões com estrelas e feedback detalhado após cada treino'
    },
    {
      icon: '🎯',
      title: 'Perfil Profissional',
      description: 'Perfil personalizado com foto, bio, especialidades, cidade e preço por sessão'
    }
  ];

  const plans = [
    {
      name: 'Básico',
      price: '15',
      period: '/mês',
      clientLimit: 'Até 10 clientes',
      features: [
        '✅ Dashboard com estatísticas',
        '✅ Gestão de clientes',
        '✅ Agendamentos ilimitados',
        '✅ Notificações por email',
        '✅ Perfil profissional',
        '✅ Suporte por email',
        '❌ Pacotes de treino',
        '❌ Estatísticas avançadas',
        '❌ Upload de vídeos'
      ],
      popular: false,
      id: 'basic'
    },
    {
      name: 'Pro',
      price: '25',
      period: '/mês',
      clientLimit: 'Até 30 clientes',
      features: [
        '✅ Tudo do Básico',
        '✅ Pacotes de treino',
        '✅ Gestão de pagamentos',
        '✅ Estatísticas detalhadas (6 meses)',
        '✅ Sistema de avaliações',
        '✅ Notas de treino',
        '✅ Emails automáticos (6 tipos)',
        '✅ Suporte prioritário',
        '❌ Upload de vídeos'
      ],
      popular: true,
      id: 'pro'
    },
    {
      name: 'Premium',
      price: '40',
      period: '/mês',
      clientLimit: 'Clientes ilimitados',
      features: [
        '✅ Tudo do Pro',
        '✅ Upload de vídeos de treino',
        '✅ Chat em tempo real',
        '✅ Planos de treino detalhados',
        '✅ Analytics avançados',
        '✅ Suporte prioritário 24/7',
        '✅ Integração com apps fitness',
        '✅ Marca personalizada (white label)',
        '✅ API de integração'
      ],
      popular: false,
      id: 'premium'
    }
  ];

  const testimonials = [
    {
      name: 'João Silva',
      role: 'Personal Trainer',
      city: 'Lisboa',
      photo: 'JS',
      rating: 5,
      text: 'O MyFitness transformou completamente a gestão do meu negócio. Antes perdia horas a enviar mensagens e a gerir pagamentos. Agora tudo é automático!'
    },
    {
      name: 'Maria Santos',
      role: 'Personal Trainer',
      city: 'Porto',
      photo: 'MS',
      rating: 5,
      text: 'Os emails automáticos e o sistema de lembretes reduziram drasticamente as faltas dos meus clientes. Recomendo a todos os personal trainers!'
    },
    {
      name: 'Pedro Costa',
      role: 'Personal Trainer',
      city: 'Braga',
      photo: 'PC',
      rating: 5,
      text: 'A interface é intuitiva e profissional. Os meus clientes adoram receber as notas de treino por email após cada sessão. Vale cada cêntimo!'
    }
  ];

  const screenshots = [
    {
      title: 'Dashboard do Trainer',
      description: 'Visualize todas as suas estatísticas em tempo real',
      color: 'from-purple-600 to-blue-600'
    },
    {
      title: 'Gestão de Clientes',
      description: 'Associe e gerencie seus clientes de forma simples',
      color: 'from-green-600 to-teal-600'
    },
    {
      title: 'Pacotes de Treino',
      description: 'Crie pacotes personalizados e venda online',
      color: 'from-pink-600 to-orange-600'
    },
    {
      title: 'Agendamentos',
      description: 'Calendário inteligente com notificações automáticas',
      color: 'from-blue-600 to-cyan-600'
    }
  ];

  const handleGetStarted = (planId) => {
    // Armazena o plano selecionado no localStorage
    localStorage.setItem('selectedPlan', planId);
    navigate('/register');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      color: '#fff',
      overflowX: 'hidden'
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(220, 20, 60, 0.2)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#dc143c',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/myfitness_logo.png" alt="MyFitness" style={{ height: '40px' }} />
          MyFitness
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button
            onClick={() => scrollToSection('pricing')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#dc143c'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.9)'}
          >
            Preços
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: '1px solid rgba(220, 20, 60, 0.5)',
              color: '#dc143c',
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(220, 20, 60, 0.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #dc143c, #ff0000)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(220, 20, 60, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(220, 20, 60, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(220, 20, 60, 0.3)';
            }}
          >
            Começar Grátis
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '100px 20px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(220,20,60,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulse 8s ease-in-out infinite',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(220,20,60,0.1)',
            border: '1px solid rgba(220,20,60,0.3)',
            borderRadius: '2px',
            marginBottom: '30px',
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#dc143c'
          }}>
            🚀 Teste grátis por 14 dias - Sem cartão de crédito
          </div>

          <h1 style={{
            fontSize: '64px',
            fontWeight: '800',
            marginBottom: '30px',
            color: '#ffffff',
            lineHeight: '1.2',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Gerencie seus clientes e treinos<br />em um só lugar
          </h1>

          <p style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            A plataforma completa para personal trainers que querem profissionalizar seu negócio,
            economizar tempo e aumentar a receita.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleGetStarted('pro')}
              style={{
                padding: '18px 40px',
                fontSize: '16px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #dc143c 0%, #b81134 100%)',
                border: 'none',
                borderRadius: '2px',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(220,20,60,0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(220,20,60,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(220,20,60,0.3)';
              }}
            >
              🚀 Comece Grátis Agora
            </button>

            <button
              onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '18px 40px',
                fontSize: '16px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'transparent',
                border: '2px solid rgba(220,20,60,0.5)',
                borderRadius: '2px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(220,20,60,0.1)';
                e.target.style.borderColor = '#dc143c';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(220,20,60,0.5)';
              }}
            >
              📺 Ver Demonstração
            </button>
          </div>

          <div style={{
            marginTop: '60px',
            display: 'flex',
            justifyContent: 'center',
            gap: '50px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#dc143c' }}>1000+</div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>Personal Trainers</div>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#dc143c' }}>50k+</div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>Clientes Ativos</div>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#dc143c' }}>98%</div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Tudo que você precisa em uma plataforma
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            marginBottom: '60px'
          }}>
            Funcionalidades desenvolvidas especialmente para personal trainers profissionais
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '40px 30px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#dc143c';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(220,20,60,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', color: '#fff' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff 0%, #8b0000 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Veja como funciona
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            marginBottom: '60px'
          }}>
            Interface moderna e intuitiva, desenvolvida para simplificar sua rotina
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '30px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  height: '200px',
                  background: `linear-gradient(135deg, ${screenshot.color.split(' ')[1]} 0%, ${screenshot.color.split(' ')[3]} 100%)`,
                  borderRadius: '12px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  📊
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {screenshot.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {screenshot.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '80px 20px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff 0%, #dc143c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Escolha o plano ideal para você
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            marginBottom: '60px'
          }}>
            14 dias grátis em qualquer plano • Cancele quando quiser • Sem taxas escondidas
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            alignItems: 'stretch'
          }}>
            {plans.map((plan, index) => (
              <div
                key={index}
                style={{
                  background: plan.popular ? 'linear-gradient(135deg, rgba(220,20,60,0.1) 0%, rgba(220,20,60,0.1) 100%)' : 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  border: plan.popular ? '2px solid #dc143c' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  padding: '40px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseOver={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = '#dc143c';
                  }
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }
                  e.currentTarget.style.transform = 'scale(1)';
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
                    boxShadow: '0 4px 20px rgba(220,20,60,0.4)'
                  }}>
                    ⭐ MAIS POPULAR
                  </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {plan.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '10px' }}>
                    <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc143c' }}>
                      €{plan.price}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: '8px' }}>
                      {plan.period}
                    </span>
                  </div>
                  <div style={{
                    background: 'rgba(220,20,60,0.1)',
                    border: '1px solid rgba(220,20,60,0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    display: 'inline-block',
                    color: '#dc143c',
                    fontSize: '14px'
                  }}>
                    {plan.clientLimit}
                  </div>
                </div>

                <div style={{ flex: 1, marginBottom: '30px' }}>
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
                  onClick={() => handleGetStarted(plan.id)}
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
                  {plan.popular ? '🚀 Começar Agora' : 'Selecionar Plano'}
                </button>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '60px',
            textAlign: 'center',
            padding: '40px',
            background: 'rgba(220,20,60,0.05)',
            border: '1px solid rgba(220,20,60,0.2)',
            borderRadius: '20px'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '15px', color: '#dc143c' }}>
              💡 Todos os planos incluem:
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              marginTop: '20px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <div>✅ 14 dias de teste grátis</div>
              <div>✅ Sem cartão de crédito</div>
              <div>✅ Cancele quando quiser</div>
              <div>✅ Atualizações gratuitas</div>
              <div>✅ Suporte em português</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff 0%, #dc143c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            O que dizem nossos trainers
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '18px',
            marginBottom: '60px'
          }}>
            Profissionais que transformaram seus negócios com o MyFitness
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '40px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#dc143c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#FFD700', fontSize: '20px' }}>⭐</span>
                  ))}
                </div>

                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '30px',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.text}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #dc143c 0%, #8b0000 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#fff'
                  }}>
                    {testimonial.photo}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                      {testimonial.role} • {testimonial.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, rgba(220,20,60,0.1) 0%, rgba(220,20,60,0.1) 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '52px',
            fontWeight: 'bold',
            marginBottom: '30px',
            background: 'linear-gradient(135deg, #dc143c 0%, #8b0000 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2'
          }}>
            Pronto para revolucionar<br />seu negócio?
          </h2>

          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Junte-se a milhares de personal trainers que já profissionalizaram seus negócios.
            Comece seu teste grátis de 14 dias agora mesmo.
          </p>

          <button
            onClick={() => handleGetStarted('pro')}
            style={{
              padding: '20px 50px',
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #dc143c 0%, #b22222 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#0a0a0a',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 40px rgba(220,20,60,0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 60px rgba(220,20,60,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 40px rgba(220,20,60,0.3)';
            }}
          >
            🚀 Começar Teste Grátis de 14 Dias
          </button>

          <div style={{
            marginTop: '30px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px'
          }}>
            Não precisa de cartão de crédito • Cancele quando quiser
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #dc143c 0%, #8b0000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MyFitness
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <a href="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
              Termos de Uso
            </a>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
              Política de Privacidade
            </a>
            <a href="/contact" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
              Contacto
            </a>
            <a href="/faq" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
              FAQ
            </a>
          </div>

          <div style={{ fontSize: '14px' }}>
            © 2025 MyFitness. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

