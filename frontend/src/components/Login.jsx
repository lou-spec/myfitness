import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setPage, setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (res.status === 403 && data.trialExpired) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        navigate("/trial-expired");
        return;
      }
      
      if (!res.ok) return alert(data.msg);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao conectar ao servidor");
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

