import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "./PhoneInput";

function Register({ setPage }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const register = async () => {
    if (!name || !email || !password) {
      return alert("Preenche todos os campos obrigatórios!");
    }

    if (password.length < 6) {
      return alert("Password deve ter pelo menos 6 caracteres!");
    }

    try {
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        return alert(data.msg || "Erro ao criar conta");
      }

      // Verifica se é pagamento direto
      const directPayment = localStorage.getItem('directPayment');
      const selectedPlan = localStorage.getItem('selectedPlan');

      if (directPayment === 'true' && selectedPlan) {
        // Login automático e redireciona para pagamento
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Limpa flags
        localStorage.removeItem('directPayment');
        localStorage.removeItem('selectedPlan');

        alert("✅ Conta criada! Serás redirecionado para o pagamento...");
        
        // Cria checkout session
        try {
          const checkoutRes = await fetch(`https://myfitness-pkft.onrender.com/api/subscription/create-checkout-session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({ plan: selectedPlan }),
          });

          const checkoutData = await checkoutRes.json();

          if (checkoutRes.ok && checkoutData.url) {
            window.location.href = checkoutData.url;
          } else {
            alert("Erro ao processar pagamento. Podes fazer login e tentar novamente.");
            navigate("/login");
          }
        } catch (err) {
          console.error("Erro ao criar checkout:", err);
          alert("Erro ao processar pagamento. Faz login e vai a Pagamentos.");
          navigate("/login");
        }
      } else {
        // Registo normal com trial
        alert("✅ Conta criada com sucesso! Tens 14 dias de teste grátis.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("❌ Erro ao conectar ao servidor. Verifica se o backend está a correr!");
    }
  };

  return (
    <div className="box">
      <h2>🚀 Criar Conta</h2>
      <input 
        placeholder="👤 Nome Completo" 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        placeholder="📧 Email" 
        type="email"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <PhoneInput 
        value={phone}
        onChange={setPhone}
        placeholder="912 345 678"
      />
      <input
        type="password"
        placeholder="🔒 Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>🎯 Criar Conta</button>
      <p onClick={() => setPage("login")} className="link">← Já tenho conta</p>
    </div>
  );
}

export default Register;

