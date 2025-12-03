import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "./ClientForm";
import AvailabilityForm from "./AvailabilityForm";
import AppointmentForm from "./AppointmentForm";
import PackageForm from "./PackageForm";
import WorkoutNotesModal from "./WorkoutNotesModal";
import ProfileEditModal from "./ProfileEditModal";
import ClientProfileSection from "./ClientProfileSection";

function TrainerDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalClients: 0,
    appointmentsThisMonth: 0,
    upcomingAppointments: [],
    totalRevenue: 0,
    pendingPayments: 0,
  });
  const [clients, setClients] = useState([]);
  const [associatedClients, setAssociatedClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showWorkoutNotes, setShowWorkoutNotes] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchClients();
    fetchAssociatedClients();
    fetchAppointments();
    fetchPackages();
    fetchPayments();
    
    // Verificar trial a cada 3 segundos (mais frequente)
    const trialCheckInterval = setInterval(checkTrialStatus, 3000);
    
    // Verificar também baseado na data local do trial a cada segundo
    const localTrialCheck = setInterval(checkLocalTrialExpiry, 1000);
    
    // Verificar quando a página fica visível (usuário volta à aba)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkLocalTrialExpiry();
        checkTrialStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(trialCheckInterval);
      clearInterval(localTrialCheck);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleTrialExpired = () => {
    localStorage.clear();
    setUser(null);
    alert("⏰ Seu período experimental expirou! Redirecionando para upgrade...");
    navigate("/trial-expired");
  };

  // Verifica expiração baseada na data local (mais rápido)
  const checkLocalTrialExpiry = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (user.role !== "trainer" || user.subscription_plan !== "trial") {
      return;
    }
    
    if (user.trial_end_date) {
      const now = new Date();
      const trialEnd = new Date(user.trial_end_date);
      
      if (now >= trialEnd) {
        handleTrialExpired();
      }
    }
  };

  // Verifica no servidor se trial expirou
  const checkTrialStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/appointments/stats/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 403) {
        const data = await res.json();
        if (data.trialExpired) {
          handleTrialExpired();
        }
      }
    } catch (err) {
      console.error("Erro ao verificar trial:", err);
    }
  };

  // Helper para verificar resposta de qualquer fetch
  const handleFetchResponse = async (response) => {
    if (response.status === 403) {
      const data = await response.json();
      if (data.trialExpired) {
        handleTrialExpired();
        return null;
      }
    }
    return response;
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const [appointmentsRes, paymentsRes] = await Promise.all([
        fetch(`https://myfitness-pkft.onrender.com/api/appointments/stats/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`https://myfitness-pkft.onrender.com/api/payments/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      
      // Verifica se trial expirou em qualquer requisição
      const checkedAppointments = await handleFetchResponse(appointmentsRes);
      const checkedPayments = await handleFetchResponse(paymentsRes);
      
      if (!checkedAppointments || !checkedPayments) return; // Trial expirou
      
      const appointmentsData = await appointmentsRes.json();
      const paymentsData = await paymentsRes.json();
      
      if (appointmentsRes.ok && paymentsRes.ok) {
        setStats({
          ...appointmentsData,
          totalRevenue: paymentsData.total || 0,
          pendingPayments: paymentsData.pending || 0,
        });
      }
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setClients(data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  const fetchAssociatedClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/auth/users-clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Filtrar apenas os que estão associados a este trainer
        const myClients = data.filter(client => 
          client.trainer_id && client.trainer_id === user.id
        );
        setAssociatedClients(myClients);
      }
    } catch (err) {
      console.error("Erro ao buscar clientes associados:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAppointments(data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPackages(data);
    } catch (err) {
      console.error("Erro ao buscar pacotes:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPayments(data);
    } catch (err) {
      console.error("Erro ao buscar pagamentos:", err);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert("Status atualizado!");
        fetchAppointments();
        fetchStats();
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const deletePackage = async (packageId) => {
    if (!confirm("Desativar este pacote?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/packages/${packageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Pacote desativado!");
        fetchPackages();
      }
    } catch (err) {
      console.error("Erro ao desativar pacote:", err);
    }
  };

  const dissociateClient = async (clientId, clientName) => {
    if (!confirm(`Tens a certeza que queres remover ${clientName} da tua lista de clientes?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/clients/dissociate-user/${clientId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.msg);
        fetchAssociatedClients();
        fetchStats();
      } else {
        alert("❌ " + data.msg);
      }
    } catch (err) {
      alert("Erro ao remover cliente");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="box dashboard-wide">
        <div className="dashboard-header">
          <div className="user-info">
            <h2>💪 Personal Trainer: {user.name}</h2>
            <p>📧 {user.email}</p>
            {user.phone && <p>📱 {user.phone}</p>}
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Visão Geral
          </button>
          <button
            className={`tab ${activeTab === "clients" ? "active" : ""}`}
            onClick={() => setActiveTab("clients")}
          >
            👥 Clientes
          </button>
          <button
            className={`tab ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            📅 Agendamentos
          </button>
          <button
            className={`tab ${activeTab === "packages" ? "active" : ""}`}
            onClick={() => setActiveTab("packages")}
          >
            📦 Pacotes
          </button>
          <button
            className={`tab ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            💰 Pagamentos
          </button>
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            ⚙️ Perfil
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total de Clientes</h3>
                <div className="value">{stats.totalClients}</div>
              </div>
              <div className="stat-card">
                <h3>Sessões este Mês</h3>
                <div className="value">{stats.appointmentsThisMonth}</div>
              </div>
              <div className="stat-card">
                <h3>Receita Total</h3>
                <div className="value">{stats.totalRevenue}€</div>
              </div>
              <div className="stat-card">
                <h3>Pagamentos Pendentes</h3>
                <div className="value">{stats.pendingPayments}</div>
              </div>
            </div>

            <div className="section">
              <h3>📅 Próximos Agendamentos</h3>
              {stats.upcomingAppointments?.length > 0 ? (
                stats.upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="appointment-item">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{apt.client_name}</strong>
                        <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                          {new Date(apt.start_datetime).toLocaleString("pt-PT")}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                          onClick={() => updateAppointmentStatus(apt._id, "done")}
                        >
                          ✅ Concluir
                        </button>
                        <button 
                          style={{ fontSize: "12px", padding: "6px 12px", background: "rgba(255, 50, 50, 0.2)" }}
                          onClick={() => updateAppointmentStatus(apt._id, "cancelled")}
                        >
                          ❌ Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ opacity: 0.6 }}>Sem agendamentos próximos</p>
              )}
            </div>

            <button onClick={() => setShowAppointmentForm(true)}>
              ➕ Novo Agendamento
            </button>
          </>
        )}

        {activeTab === "clients" && (
          <div className="section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3>👥 Meus Clientes Associados</h3>
              <button onClick={() => setShowClientForm(true)}>➕ Associar Cliente</button>
            </div>
            
            {associatedClients.length > 0 ? (
              <div className="client-list">
                {associatedClients.map((client) => (
                  <div 
                    key={client._id} 
                    className="client-item"
                    style={{ 
                      transition: "all 0.3s ease",
                      position: "relative"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                      <div 
                        style={{ flex: 1, cursor: "pointer" }}
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientModal(true);
                        }}
                      >
                        <strong style={{ fontSize: "16px" }}>{client.name}</strong>
                        <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                          📧 {client.email}
                        </p>
                        {client.phone && (
                          <p style={{ opacity: 0.7, fontSize: "14px" }}>
                            📱 {client.phone}
                          </p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setShowClientModal(true);
                          }}
                          style={{
                            padding: "8px 12px",
                            fontSize: "12px",
                            background: "rgba(220, 20, 60, 0.2)",
                            border: "1px solid rgba(220, 20, 60, 0.3)",
                          }}
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dissociateClient(client._id, client.name);
                          }}
                          style={{
                            padding: "8px 12px",
                            fontSize: "12px",
                            background: "rgba(255, 80, 80, 0.2)",
                            border: "1px solid rgba(255, 80, 80, 0.3)",
                          }}
                        >
                          🗑️ Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.6, textAlign: "center", padding: "40px 20px" }}>
                Ainda não tens clientes associados. Clica em "➕ Associar Cliente" para começar!
              </p>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3>📅 Todos os Agendamentos</h3>
              <button onClick={() => setShowAppointmentForm(true)}>➕ Novo</button>
            </div>
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt._id} className="appointment-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <strong>{apt.client_name}</strong>
                      <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                        {new Date(apt.start_datetime).toLocaleString("pt-PT")}
                      </p>
                      {apt.workout_notes && (
                        <p style={{ opacity: 0.6, fontSize: "13px", marginTop: "4px" }}>
                          📝 {apt.workout_notes.substring(0, 50)}...
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span className={`badge badge-${apt.status === 'done' ? 'success' : apt.status === 'cancelled' ? 'danger' : 'warning'}`}>
                        {apt.status}
                      </span>
                      {apt.status === "booked" && (
                        <>
                          <button 
                            style={{ fontSize: "12px", padding: "6px 12px" }}
                            onClick={() => updateAppointmentStatus(apt._id, "done")}
                          >
                            ✅
                          </button>
                          <button 
                            style={{ fontSize: "12px", padding: "6px 12px", background: "rgba(255, 50, 50, 0.2)" }}
                            onClick={() => updateAppointmentStatus(apt._id, "cancelled")}
                          >
                            ❌
                          </button>
                        </>
                      )}
                      <button 
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setShowWorkoutNotes(true);
                        }}
                      >
                        📝 Notas
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.6 }}>Sem agendamentos</p>
            )}
          </div>
        )}

        {activeTab === "packages" && (
          <div className="section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3>📦 Meus Pacotes</h3>
              <button onClick={() => {
                setEditingPackage(null);
                setShowPackageForm(true);
              }}>➕ Novo Pacote</button>
            </div>
            <p style={{ opacity: 0.7, fontSize: "14px", marginBottom: "16px" }}>
              Cria pacotes de sessões para os teus clientes comprarem.
            </p>
            {packages.length > 0 ? (
              <div style={{ display: "grid", gap: "16px" }}>
                {packages.map((pkg) => (
                  <div key={pkg._id} className="client-item" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <h4 style={{ fontSize: "18px", marginBottom: "8px" }}>{pkg.title}</h4>
                        <p style={{ opacity: 0.7, fontSize: "14px" }}>
                          🎯 {pkg.sessions_count} sessões • 💰 {pkg.price}€
                        </p>
                        {pkg.description && (
                          <p style={{ opacity: 0.6, fontSize: "13px", marginTop: "8px" }}>
                            {pkg.description}
                          </p>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          style={{ fontSize: "12px", padding: "6px 12px" }}
                          onClick={() => {
                            setEditingPackage(pkg);
                            setShowPackageForm(true);
                          }}
                        >
                          ✏️
                        </button>
                        <button 
                          style={{ fontSize: "12px", padding: "6px 12px", background: "rgba(255, 50, 50, 0.2)" }}
                          onClick={() => deletePackage(pkg._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.6 }}>Ainda não criaste pacotes</p>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="section">
            <h3>💰 Pagamentos</h3>
            <div className="stats-grid" style={{ marginTop: "20px", marginBottom: "20px" }}>
              <div className="stat-card">
                <h3>Total Recebido</h3>
                <div className="value">{stats.totalRevenue}€</div>
              </div>
              <div className="stat-card">
                <h3>Pendentes</h3>
                <div className="value">{stats.pendingPayments}</div>
              </div>
            </div>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <div key={payment._id} className="appointment-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{payment.amount}€</strong>
                      <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                        {new Date(payment.created_at).toLocaleDateString("pt-PT")}
                      </p>
                    </div>
                    <span className={`badge badge-${payment.status === 'succeeded' ? 'success' : payment.status === 'failed' ? 'danger' : 'warning'}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.6 }}>Sem pagamentos registados</p>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="section">
            <h3>⚙️ Meu Perfil</h3>
            <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" }}>
              {user.photo_url && (
                <img 
                  src={user.photo_url} 
                  alt={user.name}
                  style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "20px" }}
                />
              )}
              <p style={{ marginBottom: "8px" }}><strong>Nome:</strong> {user.name}</p>
              <p style={{ marginBottom: "8px" }}><strong>Email:</strong> {user.email}</p>
              {user.phone && <p style={{ marginBottom: "8px" }}><strong>Telemóvel:</strong> {user.phone}</p>}
              {user.city && <p style={{ marginBottom: "8px" }}><strong>Cidade:</strong> {user.city}</p>}
              {user.bio && <p style={{ marginBottom: "8px" }}><strong>Bio:</strong> {user.bio}</p>}
              {user.specialties && user.specialties.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <strong>Especialidades:</strong>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    {user.specialties.map((spec, i) => (
                      <span key={i} className="badge badge-success">{spec}</span>
                    ))}
                  </div>
                </div>
              )}
              {user.price_per_session > 0 && (
                <p style={{ marginTop: "12px" }}><strong>Preço por Sessão:</strong> {user.price_per_session}€</p>
              )}
            </div>
            <button 
              onClick={() => setShowProfileEdit(true)}
              style={{ marginTop: "20px" }}
            >
              ✏️ Editar Perfil
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={logout}>🚪 Sair</button>
        </div>

        {showClientForm && (
          <ClientForm
            onClose={() => setShowClientForm(false)}
            onSuccess={() => {
              fetchClients();
              fetchStats();
            }}
          />
        )}

        {showAvailabilityForm && (
          <AvailabilityForm
            onClose={() => setShowAvailabilityForm(false)}
            onSuccess={() => {
              alert("Disponibilidade criada com sucesso!");
            }}
          />
        )}

        {showAppointmentForm && (
          <AppointmentForm
            clients={[...clients, ...associatedClients]}
            onClose={() => setShowAppointmentForm(false)}
            onSuccess={() => {
              fetchAppointments();
              fetchStats();
            }}
          />
        )}

        {showPackageForm && (
          <PackageForm
            editPackage={editingPackage}
            onClose={() => {
              setShowPackageForm(false);
              setEditingPackage(null);
            }}
            onSuccess={() => {
              fetchPackages();
            }}
          />
        )}

        {showWorkoutNotes && selectedAppointment && (
          <WorkoutNotesModal
            appointment={selectedAppointment}
            onClose={() => {
              setShowWorkoutNotes(false);
              setSelectedAppointment(null);
            }}
            onSuccess={() => {
              fetchAppointments();
            }}
          />
        )}

        {showProfileEdit && (
          <ProfileEditModal
            user={user}
            onClose={() => setShowProfileEdit(false)}
            onSuccess={(updatedUser) => {
              setUser(updatedUser);
              fetchStats();
            }}
          />
        )}

        {showClientModal && selectedClient && (
          <ClientProfileSection 
            clientId={selectedClient._id} 
            onClose={() => {
              setShowClientModal(false);
              setSelectedClient(null);
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default TrainerDashboard;

