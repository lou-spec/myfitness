import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setPage, setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      console.log("🔵 Tentando fazer login...");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("🔵 Resposta recebida:", res.status);
      const data = await res.json();
      console.log("🔵 Dados:", data);
      
      // Se trial expirou (403), guarda token e redireciona para trial-expired
      if (res.status === 403 && data.trialExpired) {
        console.log("⚠️ Trial expirado - redirecionando para trial-expired");
        
        // Guarda token e user para poder fazer pagamento
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        navigate("/trial-expired");
        return;
      }
      
      if (!res.ok) {
        console.error("❌ Erro no login:", data.msg);
        return alert(data.msg);
      }

      console.log("✅ Login bem-sucedido");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
      alert("Erro ao conectar ao servidor. Verifica a consola (F12).");
    }
  };

  return (
    <div className="box">
      <h2>🔐 Login</h2>
      <input 
        placeholder="📧 Email" 
        type="email"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input
        type="password"
        placeholder="🔒 Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>✨ Entrar</button>
      <p onClick={() => setPage("register")} className="link">Ainda não tens conta? Criar conta →</p>
    </div>
  );
}

export default Login;

