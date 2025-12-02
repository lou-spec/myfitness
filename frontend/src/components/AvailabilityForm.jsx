import { useState } from "react";

function AvailabilityForm({ onClose, onSuccess }) {
  const [weekday, setWeekday] = useState(1); // Segunda-feira
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const weekdays = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        weekday,
        start_time: startTime,
        end_time: endTime,
        recurring: true,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Disponibilidade criada!");
      onSuccess();
      onClose();
    } else {
      alert(data.msg);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>⏰ Definir Disponibilidade</h2>

        <div className="form-group">
          <label>Dia da Semana</label>
          <select value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
            {weekdays.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Horário Início</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Horário Fim</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button onClick={handleSubmit}>✅ Criar</button>
          <button className="btn-secondary" onClick={onClose}>
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityForm;
