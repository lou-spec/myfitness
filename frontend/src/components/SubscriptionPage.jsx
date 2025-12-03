import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(savedUser);
    setUser(userData);

    if (userData.role !== "trainer") {
      navigate("/dashboard");
      return;
    }

    fetchSubscriptionInfo();
  }, [navigate]);

  const fetchSubscriptionInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://myfitness-pkft.onrender.com/api/subscription/info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setSubscriptionInfo(data);
      }
    } catch (err) {
      console.error("Erro ao buscar info de subscrição:", err);
    }
  };

  const handleUpgrade = async (plan) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://myfitness-pkft.onrender.com/api/subscription/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Erro ao processar pagamento");
        setLoading(false);
      }
    } catch (error) {
      alert("Erro ao processar pagamento");
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Tens a certeza? A subscrição ficará ativa até ao fim do período pago."
      )
    )
      return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://myfitness-pkft.onrender.com/api/subscription/cancel`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Subscrição cancelada com sucesso!");
        fetchSubscriptionInfo();
      } else {
        alert(data.message || "Erro ao cancelar subscrição");
      }
    } catch (error) {
      alert("Erro ao cancelar subscrição");
    }
  };

  const handleManageBilling = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://myfitness-pkft.onrender.com/api/subscription/create-portal-session`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Erro ao abrir portal de pagamentos");
      }
    } catch (error) {
      alert("Erro ao abrir portal de pagamentos");
    }
  };

  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: 15,
      features: [
        "20 clientes",
        "Agendamentos ilimitados",
        "Gestão de clientes",
        "Sistema de pagamentos",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 25,
      popular: true,
      features: [
        "Clientes ilimitados",
        "Todas as features do Básico",
        "Estatísticas avançadas",
        "Relatórios detalhados",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 40,
      features: [
        "Todas as features do Pro",
        "Upload de vídeos",
        "Chat em tempo real",
        "Personalização de marca",
        "Suporte prioritário",
      ],
    },
  ];

  if (!user) return null;

  return (
    <div className="app-container">
      <Navbar user={user} setUser={setUser} />

      <div className="subscription-page">
        <div className="page-header">
          <h1>💳 Gestão de Subscrição</h1>
          <p>Escolhe o plano ideal para o teu negócio</p>
        </div>

        {subscriptionInfo && (
          <div className="current-plan-card">
            <h2>Plano Atual: {subscriptionInfo.plan.toUpperCase()}</h2>
            <div className="plan-status">
              <span
                className={`status-badge ${subscriptionInfo.active ? "active" : "inactive"}`}
              >
                {subscriptionInfo.active ? "✅ Ativo" : "❌ Inativo"}
              </span>
              {subscriptionInfo.cancel_at_period_end && (
                <span className="warning-badge">
                  ⚠️ Cancelamento agendado para{" "}
                  {new Date(
                    subscriptionInfo.current_period_end
                  ).toLocaleDateString()}
                </span>
              )}
            </div>

            {subscriptionInfo.plan !== "trial" && (
              <div className="plan-actions">
                <button
                  className="btn-secondary"
                  onClick={handleManageBilling}
                >
                  🔧 Gerir Método de Pagamento
                </button>
                {!subscriptionInfo.cancel_at_period_end && (
                  <button
                    className="btn-danger"
                    onClick={handleCancelSubscription}
                  >
                    ❌ Cancelar Subscrição
                  </button>
                )}
              </div>
            )}

            <div className="usage-info">
              <h3>Utilização</h3>
              <p>
                Clientes:{" "}
                <strong>
                  {subscriptionInfo.limits?.current_clients || 0} /{" "}
                  {subscriptionInfo.limits?.max_clients === -1
                    ? "Ilimitados"
                    : subscriptionInfo.limits?.max_clients}
                </strong>
              </p>
            </div>
          </div>
        )}

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${
                subscriptionInfo?.plan === plan.id ? "current" : ""
              } ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && <div className="popular-badge">⭐ Popular</div>}

              <h2>{plan.name}</h2>
              <div className="price">
                €{plan.price}
                <span>/mês</span>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>

              {subscriptionInfo?.plan === plan.id ? (
                <button className="btn-current" disabled>
                  Plano Atual
                </button>
              ) : (
                <button
                  className="btn-upgrade"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading}
                >
                  {loading ? "A processar..." : "Escolher Plano"}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="info-section">
          <h3>ℹ️ Informações Importantes</h3>
          <ul>
            <li>✅ Todos os planos incluem 14 dias de teste grátis</li>
            <li>💳 Pagamento seguro processado pelo Stripe</li>
            <li>🔄 Podes cancelar a qualquer momento</li>
            <li>📧 Suporte por email para todos os planos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
