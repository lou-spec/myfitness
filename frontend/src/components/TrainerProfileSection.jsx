import { useState, useEffect } from "react";

function TrainerProfileSection({ trainerId, onClose }) {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainerDetails();
  }, [trainerId]);

  const fetchTrainerDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/auth/trainer/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTrainer(data);
      }
    } catch (err) {
      console.error("Erro ao buscar trainer:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll para a seção quando carregar
    if (trainer) {
      setTimeout(() => {
        const profileSection = document.getElementById('trainer-profile-section');
        if (profileSection) {
          profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [trainer]);

  if (loading) {
    return (
      <div id="trainer-profile-section" className="section" style={{ 
        marginTop: "30px",
        padding: "40px",
        textAlign: "center",
        background: "rgba(220, 20, 60, 0.05)",
        border: "2px solid rgba(220, 20, 60, 0.2)"
      }}>
        <p>A carregar perfil do trainer...</p>
      </div>
    );
  }

  if (!trainer) {
    return null;
  }

  return (
    <div 
      id="trainer-profile-section" 
      className="section" 
      style={{ 
        marginTop: "30px",
        background: "linear-gradient(135deg, rgba(220, 20, 60, 0.08), rgba(139, 0, 0, 0.08))",
        border: "2px solid rgba(220, 20, 60, 0.3)",
        position: "relative",
        scrollMarginTop: "20px"
      }}
    >
      <button 
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          background: "rgba(255, 80, 80, 0.2)",
          border: "1px solid rgba(255, 80, 80, 0.4)",
          fontSize: "14px",
          cursor: "pointer",
          borderRadius: "8px",
          color: "#fff",
          transition: "all 0.3s ease",
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 80, 80, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 80, 80, 0.2)";
        }}
      >
        ✕ Fechar
      </button>

      <div className="profile-content">
        <h2 style={{ 
          fontSize: "28px", 
          marginBottom: "30px", 
          textAlign: "center"
        }}>
          <span style={{ fontSize: "32px", marginRight: "10px" }}>🏋️</span>
          <span style={{
            background: "linear-gradient(135deg, #dc143c, #8b0000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Perfil do Personal Trainer
          </span>
        </h2>
        
        <div className="profile-header" style={{ marginBottom: "30px" }}>
          {trainer.photo_url ? (
            <img src={trainer.photo_url} alt={trainer.name} className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              {trainer.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="profile-info">
            <h3>{trainer.name}</h3>
            {trainer.city && <p className="profile-location">📍 {trainer.city}</p>}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <h4>Contacto</h4>
            <p>📧 {trainer.email}</p>
            {trainer.phone && <p>📱 {trainer.phone}</p>}
          </div>

          {trainer.price_per_session > 0 && (
            <div className="profile-section">
              <h4>Preço por Sessão</h4>
              <p className="price-highlight">
                {trainer.price_per_session}€
              </p>
            </div>
          )}

          {trainer.specialties && trainer.specialties.length > 0 && (
            <div className="profile-section">
              <h4>Especialidades</h4>
              <div className="specialties-list">
                {trainer.specialties.map((spec, idx) => (
                  <span key={idx} className="specialty-tag">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {trainer.bio && (
            <div className="profile-section">
              <h4>Sobre</h4>
              <p className="bio-text">{trainer.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrainerProfileSection;
