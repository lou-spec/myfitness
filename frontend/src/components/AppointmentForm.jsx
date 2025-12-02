import { useState } from "react";

function AppointmentForm({ clients, onClose, onSuccess }) {
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    if (!clientId || !date || !time) {
      return alert("Preenche todos os campos obrigatórios!");
    }

    const selectedClient = clients.find(c => c._id === clientId);
    if (!selectedClient) {
      return alert("Cliente não encontrado!");
    }

    const startDatetime = new Date(`${date}T${time}`);
    const endDatetime = new Date(startDatetime.getTime() + parseInt(duration) * 60000);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("https://myfitness-pkft.onrender.com/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        trainer_id: user.id,
        client_id: clientId,
        client_name: selectedClient.name,
        client_email: selectedClient.email,
        client_phone: selectedClient.phone,
        start_datetime: startDatetime.toISOString(),
        end_datetime: endDatetime.toISOString(),
        notes,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Agendamento criado com sucesso!");
      onSuccess();
      onClose();
    } else {
      alert(data.msg || "Erro ao criar agendamento");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>📅 Novo Agendamento</h2>

        <div className="form-group">
          <label>Cliente</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Seleciona um cliente</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} ({client.email})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>Horário</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Duração</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="60">1 hora</option>
            <option value="90">1 hora e 30 min</option>
            <option value="120">2 horas</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notas (opcional)</label>
          <textarea
            placeholder="Objetivos da sessão, exercícios específicos..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={handleSubmit}>✅ Criar Agendamento</button>
          <button className="btn-secondary" onClick={onClose}>
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentForm;

