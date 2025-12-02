import { useState, useEffect } from "react";

function TrainerProfileModal({ trainerId, onClose }) {
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

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>A carregar...</p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return null;
  }

  useEffect(() => {
    // Scroll para o modal quando abrir
    setTimeout(() => {
      const modalElement = document.querySelector('.profile-modal');
      if (modalElement) {
        modalElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [trainer]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal profile-modal-full" onClick={(e) => e.stopPropagation()}>
        <div className="profile-content">
          <h2 style={{ 
            fontSize: "28px", 
            marginBottom: "24px", 
            textAlign: "center",
            background: "linear-gradient(135deg, #dc143c, #8b0000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🏋️ Perfil do Personal Trainer
          </h2>
          
          <div className="profile-header">
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

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrainerProfileModal;
