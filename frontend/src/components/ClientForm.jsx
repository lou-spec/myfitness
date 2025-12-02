import { useState, useEffect } from "react";

function ClientForm({ onClose, onSuccess }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://myfitness-pkft.onrender.com/api/auth/users-clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAvailableUsers(data);
    } catch (err) {
      console.error("Erro ao buscar utilizadores:", err);
    }
  };

  const handleAssociateUser = async () => {
    if (!selectedUser) {
      alert("Seleciona um utilizador primeiro");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("https://myfitness-pkft.onrender.com/api/clients/associate-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: selectedUser._id,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ " + data.msg);
      onSuccess();
      onClose();
    } else {
      alert("❌ " + data.msg);
    }
  };

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>➕ Adicionar Cliente</h2>
        
        <div className="form-group">
          <label>🔍 Procurar Utilizador</label>
          <input
            placeholder="Nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-list" style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div 
                key={user._id} 
                className="user-card"
                onClick={() => setSelectedUser(user)}
                style={{
                  padding: "15px",
                  background: selectedUser?._id === user._id 
                    ? "rgba(220, 20, 60, 0.15)" 
                    : "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  border: selectedUser?._id === user._id 
                    ? "2px solid rgba(220, 20, 60, 0.5)" 
                    : "2px solid transparent",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "16px" }}>{user.name}</strong>
                    <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                      📧 {user.email}
                    </p>
                    {user.phone && (
                      <p style={{ opacity: 0.6, fontSize: "13px", marginTop: "2px" }}>
                        📱 {user.phone}
                      </p>
                    )}
                  </div>
                  {selectedUser?._id === user._id && (
                    <span style={{ fontSize: "24px" }}>✅</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.6, textAlign: "center", padding: "20px" }}>
              {searchTerm ? "Nenhum utilizador encontrado" : "A carregar..."}
            </p>
          )}
        </div>

        {selectedUser && (
          <div style={{ 
            marginTop: "20px", 
            padding: "16px", 
            background: "rgba(220, 20, 60, 0.1)", 
            borderRadius: "12px",
            border: "2px solid rgba(220, 20, 60, 0.3)"
          }}>
            <h4 style={{ marginBottom: "12px", fontSize: "16px" }}>✅ Utilizador Selecionado</h4>
            <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "6px" }}>{selectedUser.name}</p>
            <p style={{ opacity: 0.8, fontSize: "14px" }}>📧 {selectedUser.email}</p>
            {selectedUser.phone && (
              <p style={{ opacity: 0.8, fontSize: "14px" }}>📱 {selectedUser.phone}</p>
            )}
            <p style={{ 
              marginTop: "12px", 
              fontSize: "13px", 
              opacity: 0.7,
              lineHeight: "1.6"
            }}>
              Este utilizador será associado a ti como cliente e poderá ver os teus pacotes, agendar sessões e receber treinos personalizados.
            </p>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button 
            onClick={handleAssociateUser}
            disabled={!selectedUser}
            style={{ opacity: selectedUser ? 1 : 0.5 }}
          >
            ✅ Associar como Cliente
          </button>
          <button className="btn-secondary" onClick={onClose}>
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientForm;

