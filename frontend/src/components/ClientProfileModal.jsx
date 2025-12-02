import { useState, useEffect } from "react";

function ClientProfileModal({ clientId, onClose }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchClientDetails();
    fetchClientAppointments();
  }, [clientId]);

  const fetchClientDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setClient(data);
      }
    } catch (err) {
      console.error("Erro ao buscar cliente:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/appointments/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
      }
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
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

  if (!client) {
    return null;
  }

  const completedSessions = appointments.filter(a => a.status === 'done').length;
  const upcomingSessions = appointments.filter(a => 
    a.status === 'booked' && new Date(a.start_datetime) > new Date()
  ).length;

  useEffect(() => {
    // Scroll para o modal quando abrir
    if (client) {
      setTimeout(() => {
        const modalElement = document.querySelector('.profile-modal-full');
        if (modalElement) {
          modalElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [client]);

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
            👤 Perfil do Cliente
          </h2>
          
          <div className="profile-header">
            <div className="profile-photo-placeholder client-photo">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h3>{client.name}</h3>
              <p className="profile-subtitle">Cliente desde {new Date(client.created_at).toLocaleDateString('pt-PT')}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-section">
              <h4>Contacto</h4>
              <p>📧 {client.email}</p>
              {client.phone && <p>📱 {client.phone}</p>}
            </div>

            <div className="profile-section">
              <h4>Estatísticas</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{completedSessions}</div>
                  <div className="stat-label">Sessões Completas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{upcomingSessions}</div>
                  <div className="stat-label">Sessões Agendadas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{appointments.length}</div>
                  <div className="stat-label">Total de Sessões</div>
                </div>
              </div>
            </div>

            {client.medical_info && (
              <div className="profile-section">
                <h4>Informações Médicas</h4>
                <p className="medical-info">{client.medical_info}</p>
              </div>
            )}

            {client.notes && (
              <div className="profile-section">
                <h4>Notas</h4>
                <p className="notes-text">{client.notes}</p>
              </div>
            )}

            <div className="profile-section">
              <h4>Histórico Recente</h4>
              {appointments.length === 0 ? (
                <p className="empty-state">Sem sessões agendadas</p>
              ) : (
                <div className="appointments-list">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt._id} className="appointment-item-mini">
                      <span className="apt-date">
                        {new Date(apt.start_datetime).toLocaleDateString('pt-PT')}
                      </span>
                      <span className={`apt-status status-${apt.status}`}>
                        {apt.status === 'done' ? '✓ Completa' : 
                         apt.status === 'booked' ? '📅 Agendada' : 
                         apt.status === 'cancelled' ? '✕ Cancelada' : apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

export default ClientProfileModal;

