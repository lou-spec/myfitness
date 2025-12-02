import { useState, useEffect } from "react";
import ClientForm from "./ClientForm";
import AvailabilityForm from "./AvailabilityForm";

function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalClients: 0,
    appointmentsThisMonth: 0,
    upcomingAppointments: [],
  });
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchClients();
    fetchAppointments();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/appointments/stats/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setClients(data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAppointments(data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className="box dashboard-wide">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>👋 Bem-vindo, {user.name}!</h2>
          <p>📧 {user.email}</p>
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
              <h3>Próximas Sessões</h3>
              <div className="value">{stats.upcomingAppointments?.length || 0}</div>
            </div>
          </div>

          <div className="section">
            <h3>📅 Próximos Agendamentos</h3>
            {stats.upcomingAppointments?.length > 0 ? (
              stats.upcomingAppointments.map((apt) => (
                <div key={apt._id} className="appointment-item">
                  <strong>{apt.client_name}</strong>
                  <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                    {new Date(apt.start_datetime).toLocaleString("pt-PT")}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.6 }}>Sem agendamentos próximos</p>
            )}
          </div>
        </>
      )}

      {activeTab === "clients" && (
        <div className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3>👥 Lista de Clientes</h3>
            <button onClick={() => setShowClientForm(true)}>➕ Novo Cliente</button>
          </div>
          <div className="client-list">
            {clients.length > 0 ? (
              clients.map((client) => (
                <div key={client._id} className="client-item">
                  <strong>{client.name}</strong>
                  <p style={{ opacity: 0.7, fontSize: "14px" }}>
                    📧 {client.email} {client.phone && `| 📱 ${client.phone}`}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.6 }}>Ainda não tens clientes</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="section">
          <h3>📅 Todos os Agendamentos</h3>
          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <div key={apt._id} className="appointment-item">
                <strong>{apt.client_name}</strong>
                <p style={{ opacity: 0.7, fontSize: "14px", marginTop: "4px" }}>
                  {new Date(apt.start_datetime).toLocaleString("pt-PT")} • {apt.status}
                </p>
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.6 }}>Sem agendamentos</p>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button className="btn-secondary" onClick={() => setShowAvailabilityForm(true)}>
          ⏰ Definir Disponibilidade
        </button>
        <button onClick={logout}>🚪 Sair da Conta</button>
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
    </div>
  );
}

export default Dashboard;
