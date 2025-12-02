import { useState, useEffect } from "react";

function TrainerSelectionModal({ onClose, onSuccess }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/trainers`);
      const data = await res.json();
      if (res.ok) {
        setTrainers(data);
      }
    } catch (err) {
      console.error("Erro ao buscar trainers:", err);
    } finally {
      setLoading(false);
    }
  };

  const associateTrainer = async () => {
    if (!selectedTrainer) {
      alert("Seleciona um personal trainer");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/associate-trainer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trainer_id: selectedTrainer._id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.msg);
        onSuccess(data.user);
        onClose();
      } else {
        alert("❌ " + data.msg);
      }
    } catch (err) {
      alert("Erro ao associar trainer");
    }
  };

  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: "700px", maxHeight: "85vh", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏋️ Escolhe o Teu Personal Trainer</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-group" style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Procurar por nome, cidade ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: "14px" }}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>A carregar trainers...</p>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}>
            {filteredTrainers.length > 0 ? (
              <div style={{ display: "grid", gap: "12px" }}>
                {filteredTrainers.map((trainer) => (
                  <div
                    key={trainer._id}
                    className="user-card"
                    style={{
                      cursor: "pointer",
                      border: selectedTrainer?._id === trainer._id 
                        ? "2px solid rgba(220, 20, 60, 0.6)" 
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      background: selectedTrainer?._id === trainer._id
                        ? "rgba(220, 20, 60, 0.1)"
                        : "rgba(255, 255, 255, 0.03)",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => setSelectedTrainer(trainer)}
                    onMouseEnter={(e) => {
                      if (selectedTrainer?._id !== trainer._id) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTrainer?._id !== trainer._id) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      }
                    }}
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      {trainer.photo_url ? (
                        <img
                          src={trainer.photo_url}
                          alt={trainer.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid rgba(220, 20, 60, 0.3)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#fff",
                          }}
                        >
                          {trainer.name.charAt(0)}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "18px", marginBottom: "6px" }}>
                          {trainer.name}
                          {selectedTrainer?._id === trainer._id && (
                            <span style={{ marginLeft: "8px", color: "#dc143c" }}>✓</span>
                          )}
                        </h4>
                        <p style={{ opacity: 0.7, fontSize: "13px", marginBottom: "4px" }}>
                          📧 {trainer.email}
                        </p>
                        {trainer.city && (
                          <p style={{ opacity: 0.7, fontSize: "13px", marginBottom: "4px" }}>
                            📍 {trainer.city}
                          </p>
                        )}
                        {trainer.price_per_session > 0 && (
                          <p style={{ fontSize: "15px", fontWeight: "600", color: "#dc143c", marginTop: "6px" }}>
                            💰 {trainer.price_per_session}€ por sessão
                          </p>
                        )}
                        {trainer.specialties && trainer.specialties.length > 0 && (
                          <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {trainer.specialties.map((spec, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: "11px",
                                  padding: "3px 8px",
                                  background: "rgba(220, 20, 60, 0.1)",
                                  border: "1px solid rgba(220, 20, 60, 0.2)",
                                  borderRadius: "12px",
                                  color: "rgba(220, 20, 60, 0.9)",
                                }}
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                        {trainer.bio && (
                          <p style={{ opacity: 0.6, fontSize: "12px", marginTop: "8px", lineHeight: "1.5" }}>
                            {trainer.bio.substring(0, 100)}{trainer.bio.length > 100 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", opacity: 0.6 }}>Nenhum trainer encontrado</p>
            )}
          </div>
        )}

        <div className="modal-footer" style={{ display: "flex", gap: "12px" }}>
          <button onClick={associateTrainer} disabled={!selectedTrainer}>
            ✅ Associar ao Trainer
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrainerSelectionModal;

