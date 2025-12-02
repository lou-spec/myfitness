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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        return alert(data.msg || "Erro ao criar conta");
      }

      alert("✅ Conta criada com sucesso!");
      navigate("/login");
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

