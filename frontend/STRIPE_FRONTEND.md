# 🎨 Frontend - Implementação Stripe

Guia para implementar as páginas de pagamento e gestão de subscrições no frontend React.

## 📦 Componentes a Criar

### 1. ✅ SubscriptionPlans.jsx
Página com os 3 planos de subscrição (cards comparativos).

**Localização**: `src/components/SubscriptionPlans.jsx`

**Funcionalidades**:
- Mostra cards dos 3 planos: Basic, Pro, Premium
- Destaca o plano atual do user
- Botão "Fazer Upgrade" para cada plano
- Chama API para criar checkout session
- Redireciona para Stripe Checkout

**Exemplo de estrutura**:
```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubscriptionPlans() {
  const [currentPlan, setCurrentPlan] = useState('trial');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/subscription/info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCurrentPlan(data.plan);
  };

  const handleUpgrade = async (plan) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const { data } = await axios.post(
        '/api/subscription/create-checkout-session',
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Redirecionar para Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao processar pagamento');
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Basic',
      price: 15,
      features: [
        '20 clientes',
        'Agendamentos ilimitados',
        'Gestão de clientes',
        'Sistema de pagamentos'
      ]
    },
    {
      name: 'Pro',
      price: 30,
      features: [
        'Clientes ilimitados',
        'Todas as features do Basic',
        'Estatísticas avançadas',
        'Relatórios detalhados'
      ]
    },
    {
      name: 'Premium',
      price: 50,
      features: [
        'Todas as features do Pro',
        'Upload de vídeos',
        'Chat em tempo real',
        'Personalização de marca',
        'Suporte prioritário'
      ]
    }
  ];

  return (
    <div className="plans-container">
      <h1>Escolhe o Teu Plano</h1>
      <div className="plans-grid">
        {plans.map(plan => (
          <div key={plan.name} className={`plan-card ${currentPlan === plan.name.toLowerCase() ? 'current' : ''}`}>
            <h2>{plan.name}</h2>
            <div className="price">€{plan.price}<span>/mês</span></div>
            <ul>
              {plan.features.map(f => <li key={f}>✓ {f}</li>)}
            </ul>
            <button 
              onClick={() => handleUpgrade(plan.name.toLowerCase())}
              disabled={loading || currentPlan === plan.name.toLowerCase()}
            >
              {currentPlan === plan.name.toLowerCase() ? 'Plano Atual' : 'Escolher Plano'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 2. ✅ SubscriptionManagement.jsx
Página para gerir subscrição atual (ver info, cancelar, billing portal).

**Localização**: `src/components/SubscriptionManagement.jsx`

**Funcionalidades**:
- Mostra plano atual e data de renovação
- Botão "Alterar Plano" (redireciona para SubscriptionPlans)
- Botão "Cancelar Subscrição"
- Botão "Gerir Método de Pagamento" (abre Stripe Portal)
- Mostra limites atuais vs usados

**Exemplo de estrutura**:
```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubscriptionManagement() {
  const [subInfo, setSubInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/subscription/info', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSubInfo(data);
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm('Tens a certeza? A subscrição ficará ativa até ao fim do período pago.')) return;
    
    const token = localStorage.getItem('token');
    await axios.post('/api/subscription/cancel', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert('Subscrição cancelada com sucesso');
    fetchSubscriptionInfo();
  };

  const openBillingPortal = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.post('/api/subscription/create-portal-session', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.href = data.url;
  };

  if (loading) return <div>A carregar...</div>;

  return (
    <div className="subscription-management">
      <h1>Gestão de Subscrição</h1>
      
      <div className="current-plan">
        <h2>Plano Atual: {subInfo.plan.toUpperCase()}</h2>
        <p>Estado: {subInfo.active ? '✅ Ativa' : '❌ Inativa'}</p>
        {subInfo.cancel_at_period_end && (
          <p className="warning">⚠️ Subscrição será cancelada em {new Date(subInfo.current_period_end).toLocaleDateString()}</p>
        )}
      </div>

      <div className="usage">
        <h3>Utilização</h3>
        <p>Clientes: {subInfo.limits.current_clients} / {subInfo.limits.max_clients === -1 ? 'Ilimitados' : subInfo.limits.max_clients}</p>
      </div>

      <div className="actions">
        <button onClick={() => window.location.href = '/subscription-plans'}>
          Alterar Plano
        </button>
        <button onClick={openBillingPortal}>
          Gerir Método de Pagamento
        </button>
        {subInfo.plan !== 'trial' && !subInfo.cancel_at_period_end && (
          <button onClick={handleCancel} className="danger">
            Cancelar Subscrição
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### 3. ✅ Atualizar TrialExpired.jsx
Modificar o componente existente para usar o sistema real de pagamento.

**Localização**: `src/components/TrialExpired.jsx`

**Modificações**:
- Remover lógica mock
- Adicionar chamada real à API: `POST /api/subscription/create-checkout-session`
- Mostrar os 3 planos com preços reais

**Exemplo**:
```jsx
// Dentro de TrialExpired.jsx
const handleUpgrade = async (plan) => {
  const token = localStorage.getItem('token');
  
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/subscription/create-checkout-session',
      { plan },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    window.location.href = data.url;
  } catch (error) {
    alert('Erro ao processar pagamento');
  }
};
```

---

### 4. ✅ ClientLimitModal.jsx (Novo)
Modal que aparece quando trainer tenta adicionar cliente mas atingiu o limite.

**Localização**: `src/components/ClientLimitModal.jsx`

**Funcionalidades**:
- Mostra mensagem de limite atingido
- Mostra plano atual e quantos clientes tem
- Botão "Fazer Upgrade" que redireciona para SubscriptionPlans

**Exemplo**:
```jsx
export default function ClientLimitModal({ show, onClose, currentPlan, currentClients, maxClients }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>⚠️ Limite de Clientes Atingido</h2>
        <p>
          O teu plano <strong>{currentPlan}</strong> permite até <strong>{maxClients}</strong> clientes.
          Atualmente tens <strong>{currentClients}</strong> clientes.
        </p>
        <p>
          Faz upgrade para adicionar mais clientes!
        </p>
        <div className="modal-actions">
          <button onClick={() => window.location.href = '/subscription-plans'}>
            Ver Planos
          </button>
          <button onClick={onClose} className="secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### 5. ✅ Atualizar TrainerDashboard.jsx
Adicionar informação da subscrição no dashboard.

**Localização**: `src/components/TrainerDashboard.jsx`

**Modificações**:
- Adicionar card com info da subscrição
- Mostrar plano atual e limites
- Botão "Gerir Subscrição"
- Badge de warning se trial a expirar

**Exemplo de adição**:
```jsx
// No TrainerDashboard.jsx
const [subscriptionInfo, setSubscriptionInfo] = useState(null);

useEffect(() => {
  fetchSubscriptionInfo();
}, []);

const fetchSubscriptionInfo = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get('/api/subscription/info', {
    headers: { Authorization: `Bearer ${token}` }
  });
  setSubscriptionInfo(data);
};

// No JSX, adicionar:
<div className="subscription-card">
  <h3>Plano: {subscriptionInfo?.plan.toUpperCase()}</h3>
  <p>Clientes: {subscriptionInfo?.limits.current_clients} / {subscriptionInfo?.limits.max_clients === -1 ? '∞' : subscriptionInfo?.limits.max_clients}</p>
  <button onClick={() => navigate('/subscription-management')}>
    Gerir Subscrição
  </button>
</div>
```

---

## 🛣️ Rotas a Adicionar

No ficheiro principal de rotas (ex: `App.jsx`), adicionar:

```jsx
import SubscriptionPlans from './components/SubscriptionPlans';
import SubscriptionManagement from './components/SubscriptionManagement';

// Dentro do Router:
<Route path="/subscription-plans" element={<SubscriptionPlans />} />
<Route path="/subscription-management" element={<SubscriptionManagement />} />
```

---

## 🎨 CSS Sugerido

### Para SubscriptionPlans:
```css
.plans-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.plan-card {
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.plan-card.current {
  border-color: #dc143c;
  background-color: #fff5f5;
}

.price {
  font-size: 3rem;
  font-weight: bold;
  color: #dc143c;
  margin: 1rem 0;
}

.price span {
  font-size: 1.5rem;
  color: #666;
}

.plan-card ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
}

.plan-card li {
  padding: 0.5rem 0;
  color: #333;
}

.plan-card button {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: #dc143c;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.plan-card button:hover:not(:disabled) {
  background-color: #b0102c;
}

.plan-card button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

---

## 🔄 Fluxo de Utilizador

### Cenário 1: Trainer no Trial
1. Está no dashboard
2. Vê badge "Trial - X dias restantes"
3. Clica em "Fazer Upgrade"
4. Vê página SubscriptionPlans
5. Escolhe plano (ex: Pro - €30)
6. É redirecionado para Stripe Checkout
7. Completa pagamento
8. Volta para /dashboard
9. Agora tem plano Pro ativo

### Cenário 2: Trainer Atinge Limite
1. Tenta adicionar 21º cliente (tem plano Basic)
2. Backend retorna erro 403 com `upgrade_required: true`
3. Frontend mostra ClientLimitModal
4. User clica "Ver Planos"
5. Vê SubscriptionPlans com destaque no upgrade
6. Escolhe Pro ou Premium
7. Completa pagamento
8. Volta e consegue adicionar cliente

### Cenário 3: Gerir Subscrição
1. Vai a /subscription-management
2. Vê plano atual: "Pro"
3. Vê data renovação: "Próxima cobrança: 15/02/2024"
4. Clica "Gerir Método de Pagamento"
5. Abre Stripe Customer Portal
6. Atualiza cartão de crédito
7. Volta para dashboard

---

## 📊 Handling de Erros no Frontend

### Quando backend retorna 403 (limite atingido):
```javascript
axios.post('/api/clients', data, { headers: { Authorization: `Bearer ${token}` }})
  .catch(error => {
    if (error.response?.status === 403 && error.response?.data?.upgrade_required) {
      // Mostrar ClientLimitModal
      setShowLimitModal(true);
      setLimitInfo({
        plan: error.response.data.current_plan,
        currentClients: error.response.data.current_clients,
        maxClients: error.response.data.client_limit
      });
    } else {
      alert(error.response?.data?.message || 'Erro ao adicionar cliente');
    }
  });
```

---

## ✅ Checklist de Implementação

### Componentes:
- [ ] Criar `SubscriptionPlans.jsx`
- [ ] Criar `SubscriptionManagement.jsx`
- [ ] Criar `ClientLimitModal.jsx`
- [ ] Atualizar `TrialExpired.jsx`
- [ ] Atualizar `TrainerDashboard.jsx`

### Rotas:
- [ ] Adicionar `/subscription-plans`
- [ ] Adicionar `/subscription-management`

### CSS:
- [ ] Estilos para cards de planos
- [ ] Estilos para modal de limite
- [ ] Badge de trial no dashboard
- [ ] Responsividade mobile

### Integrações:
- [ ] Axios calls para todas as APIs Stripe
- [ ] Error handling para 403 (limites)
- [ ] Redirecionamento pós-pagamento
- [ ] Loading states durante checkout

### Testes:
- [ ] Testar fluxo completo de upgrade
- [ ] Testar cancelamento
- [ ] Testar billing portal
- [ ] Testar modal de limite
- [ ] Testar trial expirado

---

## 🔗 URLs de Redirecionamento

### Success URL (após pagamento):
Configure no backend (`subscriptionController.js`):
```javascript
success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`
```

### Cancel URL (se user cancelar no Stripe):
```javascript
cancel_url: `${process.env.FRONTEND_URL}/subscription-plans?payment=cancelled`
```

### Adicionar ao .env do backend:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Deploy

### Variáveis de Produção:
1. Trocar `STRIPE_SECRET_KEY` de test para live
2. Trocar `STRIPE_PRICE_ID`s para IDs de produção
3. Configurar webhook em produção (URL real)
4. Atualizar `FRONTEND_URL` para domínio real

---

✅ **Está tudo pronto no backend!** Agora é só implementar estes componentes no frontend.
