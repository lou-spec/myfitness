import { useState, useEffect } from "react";

function ClientProfileSection({ clientId, onClose }) {
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
      const res = await fetch("https://myfitness-pkft.onrender.com/api/auth/user/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setClient(data);
      } else {
        console.error("Erro ao buscar cliente:", data.msg);
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
      const res = await fetch("https://myfitness-pkft.onrender.com/api/appointments/client/${clientId}`, {
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

  useEffect(() => {
    if (client) {
      setTimeout(() => {
        const profileSection = document.getElementById('client-profile-section');
        if (profileSection) {
          profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [client]);

  if (loading) {
    return (
      <div id="client-profile-section" className="section" style={{ 
        marginTop: "30px",
        padding: "40px",
        textAlign: "center",
        background: "rgba(139, 0, 0, 0.05)",
        border: "2px solid rgba(139, 0, 0, 0.2)"
      }}>
        <p>A carregar perfil do cliente...</p>
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

  return (
    <div 
      id="client-profile-section" 
      className="section" 
      style={{ 
        marginTop: "30px",
        background: "linear-gradient(135deg, rgba(139, 0, 0, 0.08), rgba(138, 43, 226, 0.08))",
        border: "2px solid rgba(139, 0, 0, 0.3)",
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
          <span style={{ fontSize: "32px", marginRight: "10px" }}>👤</span>
          <span style={{
            background: "linear-gradient(135deg, #dc143c, #8b0000)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Perfil do Cliente
          </span>
        </h2>

        <div className="profile-header" style={{ marginBottom: "30px" }}>
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
    </div>
  );
}

export default ClientProfileSection;

