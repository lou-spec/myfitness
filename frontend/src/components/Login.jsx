import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setPage, setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    // Se trial expirou, redireciona para tela de upgrade
    if (data.trialExpired) {
      localStorage.setItem("expiredUser", JSON.stringify({ email, name: data.name || email }));
      navigate("/trial-expired");
      return;
    }
    
    if (!res.ok) return alert(data.msg);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/dashboard");
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

