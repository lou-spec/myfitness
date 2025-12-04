import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrainerProfileSection from "./TrainerProfileSection";
import CancellationModal from "./CancellationModal";

function ClientDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    nextAppointment: null,
    totalSessions: 0,
    completedSessions: 0,
  });
  const [trainer, setTrainer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchTrainer();
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (trainer) {
      fetchPackages();
    }
  }, [trainer]);

  const fetchTrainer = async () => {
    if (!user.trainer_id) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/trainer/${user.trainer_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTrainer(data);
      }
    } catch (err) {
      console.error("Erro ao buscar trainer:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Verificar se o trainer está inativo
      if (res.status === 403) {
        const data = await res.json();
        if (data.trainerInactive || data.trainerTrialExpired) {
          alert(`⚠️ ${data.message}\n\nContacta o teu personal trainer para reativar a subscrição.`);
          return;
        }
      }
      
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
        
        // Calcular estatísticas
        const completed = data.filter(a => a.status === 'done').length;
        const upcoming = data.find(a => 
          a.status === 'booked' && new Date(a.start_datetime) > new Date()
        );
        
        setStats({
          nextAppointment: upcoming,
          totalSessions: data.length,
          completedSessions: completed,
        });
      }
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const trainerId = trainer?._id || user.trainer_id;
      if (!trainerId) return;
      
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/packages/trainer/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 403) {
        const data = await res.json();
        if (data.trainerInactive || data.trainerTrialExpired) {
          return; // Já mostra o banner no overview, não precisa alert aqui
        }
      }
      
      const data = await res.json();
      if (res.ok) setPackages(data);
    } catch (err) {
      console.error("Erro ao buscar pacotes:", err);
    }
  };

  const submitFeedback = async () => {
    if (!rating || !feedback) {
      alert("Preenche a avaliação e feedback");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/appointments/${selectedAppointment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_rating: rating,
          client_feedback: feedback,
        }),
      });

      if (res.ok) {
        alert("Feedback enviado!");
        setShowFeedbackModal(false);
        setSelectedAppointment(null);
        setRating(0);
        setFeedback("");
        fetchAppointments();
      }
    } catch (err) {
      alert("Erro ao enviar feedback");
    }
  };

  const cancelAppointment = async (cancellationReason) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/appointments/${appointmentToCancel._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: "cancelled",
          cancellation_reason: cancellationReason 
        }),
      });

      if (res.ok) {
        alert("Sessão cancelada! O teu personal trainer foi notificado por email.");
        setShowCancellationModal(false);
        setAppointmentToCancel(null);
        fetchAppointments();
      } else {
        const data = await res.json();
        alert(data.msg || "Erro ao cancelar sessão");
      }
    } catch (err) {
      alert("Erro ao cancelar sessão");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="box dashboard-wide" style={{ maxWidth: "900px" }}>
        <div className="dashboard-header">
          <div className="user-info">
            <h2>👋 Olá, {user.name}!</h2>
            <p>📧 {user.email}</p>
            {user.phone && <p>📱 {user.phone}</p>}
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Início
          </button>
          <button
            className={`tab ${activeTab === "sessions" ? "active" : ""}`}
            onClick={() => setActiveTab("sessions")}
          >
            📅 Minhas Sessões
          </button>
          <button
            className={`tab ${activeTab === "packages" ? "active" : ""}`}
            onClick={() => setActiveTab("packages")}
          >
            📦 Pacotes
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* No Trainer - Show Info */}
            {!trainer && !user.trainer_id && (
              <div 
                className="section" 
                style={{ 
                  background: "linear-gradient(135deg, rgba(139, 0, 0, 0.15), rgba(138, 43, 226, 0.15))", 
                  border: "2px solid rgba(139, 0, 0, 0.4)",
                  textAlign: "center"
                }}
              >
                <h3 style={{ fontSize: "22px", marginBottom: "12px" }}>🎯 Começa a Tua Jornada Fitness</h3>
                <p style={{ opacity: 0.8, fontSize: "15px", marginBottom: "12px", lineHeight: "1.8" }}>
                  Ainda não tens um personal trainer associado.
                </p>
                <p style={{ opacity: 0.7, fontSize: "14px", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto" }}>
                  💡 <strong>Como funciona:</strong> Um personal trainer precisa de te associar como cliente. 
                  Contacta um profissional e fornece o teu email <strong>({user.email})</strong> para que ele te possa adicionar!
                </p>
              </div>
            )}

            {/* Aviso se Trainer Inativo */}
            {trainer && !trainer.subscription_active && (
              <div 
                className="section" 
                style={{ 
                  background: "linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.15))", 
                  border: "2px solid rgba(255, 193, 7, 0.5)",
                  textAlign: "center"
                }}
              >
                <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#ffc107" }}>⚠️ Acesso Temporariamente Limitado</h3>
                <p style={{ opacity: 0.9, fontSize: "15px", lineHeight: "1.8" }}>
                  O teu personal trainer <strong>{trainer.name}</strong> está com a subscrição inativa.
                </p>
                <p style={{ opacity: 0.8, fontSize: "14px", marginTop: "12px" }}>
                  Contacta-o para reativar e continuar a usar todas as funcionalidades.
                </p>
              </div>
            )}

            {/* Trainer Info */}
            {trainer && (
              <div 
                className="section" 
                style={{ 
                  background: "linear-gradient(135deg, rgba(220, 20, 60, 0.1), rgba(139, 0, 0, 0.1))", 
                  border: "2px solid rgba(220, 20, 60, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onClick={() => setShowTrainerModal(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(220, 20, 60, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <h3>💪 Teu Personal Trainer</h3>
                  <span style={{ fontSize: "20px", opacity: 0.6 }}>👁️ Ver Perfil</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "16px" }}>
                  {trainer.photo_url && (
                    <img 
                      src={trainer.photo_url} 
                      alt={trainer.name}
                      style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  )}
                  <div>
                    <h4 style={{ fontSize: "20px", marginBottom: "8px", color: "#DC143C" }}>{trainer.name}</h4>
                    <p style={{ opacity: 0.7, fontSize: "14px" }}>📧 {trainer.email}</p>
                    {trainer.phone && <p style={{ opacity: 0.7, fontSize: "14px" }}>📱 {trainer.phone}</p>}
                    {trainer.city && <p style={{ opacity: 0.7, fontSize: "14px" }}>📍 {trainer.city}</p>}
                    {trainer.price_per_session > 0 && (
                      <p style={{ marginTop: "8px", fontSize: "16px", fontWeight: "600", color: "#dc143c" }}>
                        💰 {trainer.price_per_session}€ por sessão
                      </p>
                    )}
                    {trainer.specialties && trainer.specialties.length > 0 && (
                      <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {trainer.specialties.map((spec, i) => (
                          <span key={i} className="badge badge-success">{spec}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {trainer.bio && (
                  <p style={{ marginTop: "16px", opacity: 0.8, fontSize: "14px", lineHeight: "1.6" }}>
                    {trainer.bio}
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total de Sessões</h3>
                <div className="value">{stats.totalSessions}</div>
              </div>
              <div className="stat-card">
                <h3>Sessões Completas</h3>
                <div className="value">{stats.completedSessions}</div>
              </div>
              <div className="stat-card">
                <h3>Próxima Sessão</h3>
                <div className="value" style={{ fontSize: "16px", fontWeight: "600" }}>
                  {stats.nextAppointment 
                    ? new Date(stats.nextAppointment.start_datetime).toLocaleDateString("pt-PT")
                    : "Nenhuma"}
                </div>
              </div>
            </div>

            {/* Next Appointment */}
            {stats.nextAppointment && (
              <div className="section" style={{ background: "rgba(220, 20, 60, 0.05)", border: "2px solid rgba(220, 20, 60, 0.2)" }}>
                <h3>📅 Próxima Sessão Agendada</h3>
                <div className="appointment-item" style={{ marginTop: "16px", background: "rgba(220, 20, 60, 0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: "18px" }}>
                        {new Date(stats.nextAppointment.start_datetime).toLocaleDateString("pt-PT", { 
                          weekday: "long", 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      </strong>
                      <p style={{ opacity: 0.8, fontSize: "16px", marginTop: "8px" }}>
                        ⏰ {new Date(stats.nextAppointment.start_datetime).toLocaleTimeString("pt-PT", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <button 
                      style={{ fontSize: "12px", padding: "8px 16px", background: "rgba(255, 50, 50, 0.3)" }}
                      onClick={() => cancelAppointment(stats.nextAppointment._id)}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "sessions" && (
          <div className="section">
            <h3>📋 Minhas Sessões</h3>
            {appointments.length > 0 ? (
              <div className="client-list">
                {appointments.map((apt) => (
                  <div key={apt._id} className="client-item">
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <strong>{new Date(apt.start_datetime).toLocaleDateString("pt-PT")}</strong>
                        <span className={`badge badge-${apt.status === 'done' ? 'success' : apt.status === 'cancelled' ? 'danger' : 'warning'}`}>
                          {apt.status === 'done' ? '✓ Completo' : 
                           apt.status === 'cancelled' ? '✕ Cancelado' : 
                           apt.status === 'booked' ? '⏳ Agendado' : apt.status}
                        </span>
                      </div>
                      <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                        ⏰ {new Date(apt.start_datetime).toLocaleTimeString("pt-PT", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                      {apt.workout_notes && (
                        <div style={{ marginTop: "12px", padding: "12px", background: "rgba(220, 20, 60, 0.08)", borderRadius: "8px" }}>
                          <strong style={{ fontSize: "13px", opacity: 0.8 }}>📝 Notas do Trainer:</strong>
                          <p style={{ fontSize: "14px", marginTop: "4px", lineHeight: "1.5" }}>{apt.workout_notes}</p>
                        </div>
                      )}
                      {apt.client_rating && (
                        <p style={{ marginTop: "8px", opacity: 0.7 }}>
                          ⭐ Tua avaliação: {apt.client_rating}/5
                        </p>
                      )}
                      {apt.status === 'done' && !apt.client_rating && (
                        <button 
                          style={{ marginTop: "12px", fontSize: "12px", padding: "6px 12px" }}
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowFeedbackModal(true);
                          }}
                        >
                          ⭐ Avaliar Sessão
                        </button>
                      )}
                      {apt.status === 'booked' && new Date(apt.start_datetime) > new Date() && (
                        <button 
                          style={{ marginTop: "12px", fontSize: "12px", padding: "6px 12px", background: "rgba(255, 50, 50, 0.2)" }}
                          onClick={() => {
                            setAppointmentToCancel(apt);
                            setShowCancellationModal(true);
                          }}
                        >
                          ❌ Cancelar Sessão
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.6 }}>Ainda não tens sessões agendadas</p>
            )}
          </div>
        )}

        {activeTab === "packages" && (
          <div className="section">
            <h3>📦 Pacotes Disponíveis</h3>
            {!trainer && user.trainer_id && (
              <p style={{ opacity: 0.6, marginTop: "20px" }}>A carregar pacotes...</p>
            )}
            {!trainer && !user.trainer_id && (
              <div style={{ opacity: 1, marginTop: "20px", background: "rgba(255, 193, 7, 0.1)", padding: "20px", borderRadius: "12px", border: "2px solid rgba(255, 193, 7, 0.3)" }}>
                <p style={{ fontSize: "15px", marginBottom: "12px", lineHeight: "1.6" }}>
                  ⚠️ Ainda não tens pacotes disponíveis. 
                </p>
                <p style={{ opacity: 0.8, fontSize: "13px", lineHeight: "1.6" }}>
                  💡 Um personal trainer precisa de te associar como cliente primeiro. Contacta um profissional e fornece o teu email para começar!
                </p>
              </div>
            )}
            {trainer && packages.length > 0 ? (
              <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
                {packages.map((pkg) => (
                  <div key={pkg._id} className="client-item" style={{ padding: "20px" }}>
                    <h4 style={{ fontSize: "20px", marginBottom: "12px" }}>{pkg.title}</h4>
                    
                    {/* Trainer Info no Pacote */}
                    {pkg.trainer_id && (
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "12px", 
                          padding: "12px", 
                          background: "rgba(220, 20, 60, 0.05)",
                          borderRadius: "8px",
                          marginBottom: "16px",
                          cursor: "pointer",
                          border: "1px solid rgba(220, 20, 60, 0.2)"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTrainerModal(true);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(220, 20, 60, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(220, 20, 60, 0.05)";
                        }}
                      >
                        {pkg.trainer_id.photo_url ? (
                          <img 
                            src={pkg.trainer_id.photo_url} 
                            alt={pkg.trainer_id.name}
                            style={{ 
                              width: "40px", 
                              height: "40px", 
                              borderRadius: "50%", 
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#fff"
                          }}>
                            {pkg.trainer_id.name.charAt(0)}
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                            {pkg.trainer_id.name}
                          </p>
                          {pkg.trainer_id.city && (
                            <p style={{ fontSize: "12px", opacity: 0.7 }}>📍 {pkg.trainer_id.city}</p>
                          )}
                        </div>
                        <span style={{ fontSize: "16px", opacity: 0.5 }}>👁️</span>
                      </div>
                    )}
                    
                    <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "12px" }}>
                      <div>
                        <p style={{ fontSize: "32px", fontWeight: "700", color: "#dc143c" }}>
                          {pkg.price}€
                        </p>
                      </div>
                      <div>
                        <p style={{ opacity: 0.8 }}>🎯 {pkg.sessions_count} sessões</p>
                        <p style={{ opacity: 0.6, fontSize: "14px" }}>
                          {(pkg.price / pkg.sessions_count).toFixed(2)}€ por sessão
                        </p>
                      </div>
                    </div>
                    {pkg.description && (
                      <p style={{ opacity: 0.7, fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                        {pkg.description}
                      </p>
                    )}
                    <button 
                      style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                      onClick={() => alert("Funcionalidade de pagamento em breve!")}
                    >
                      💳 Comprar Pacote
                    </button>
                  </div>
                ))}
              </div>
            ) : trainer ? (
              <p style={{ opacity: 0.6 }}>O teu personal trainer ainda não criou pacotes</p>
            ) : null}
          </div>
        )}

        <button onClick={logout} style={{ marginTop: "20px" }}>🚪 Sair</button>

        {/* Feedback Modal */}
        {showFeedbackModal && selectedAppointment && (
          <div className="modal">
            <div className="modal-content">
              <h2>⭐ Avaliar Sessão</h2>
              <p style={{ opacity: 0.7, fontSize: "14px", marginBottom: "20px" }}>
                {new Date(selectedAppointment.start_datetime).toLocaleDateString("pt-PT")}
              </p>
              
              <div className="form-group">
                <label>Avaliação (1-5)</label>
                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        fontSize: "32px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        opacity: rating >= star ? 1 : 0.3,
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  placeholder="Como foi a sessão? O que achaste?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button onClick={submitFeedback}>✅ Enviar</button>
                <button 
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedAppointment(null);
                    setRating(0);
                    setFeedback("");
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {showCancellationModal && appointmentToCancel && (
          <CancellationModal
            appointment={appointmentToCancel}
            onClose={() => {
              setShowCancellationModal(false);
              setAppointmentToCancel(null);
            }}
            onConfirm={cancelAppointment}
          />
        )}

        {/* Trainer Profile Section */}
        {showTrainerModal && trainer && (
          <TrainerProfileSection 
            trainerId={trainer._id} 
            onClose={() => setShowTrainerModal(false)} 
          />
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;

