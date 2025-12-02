import { useState } from "react";

function WorkoutNotesModal({ appointment, onClose, onSuccess }) {
  const [workoutNotes, setWorkoutNotes] = useState(appointment.workout_notes || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workout_notes: workoutNotes,
        }),
      });

      if (res.ok) {
        alert("Notas guardadas com sucesso!");
        onSuccess();
        onClose();
      } else {
        alert("Erro ao guardar notas");
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>📝 Notas do Treino</h2>
        <p style={{ opacity: 0.7, fontSize: "14px", marginBottom: "16px" }}>
          <strong>{appointment.client_name}</strong> - {new Date(appointment.start_datetime).toLocaleString("pt-PT")}
        </p>
        
        <div className="form-group">
          <label>Notas do Treino</label>
          <textarea
            placeholder="Exercícios realizados, performance, observações..."
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            rows={8}
            style={{ fontSize: "14px", lineHeight: "1.6" }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            {loading ? "A guardar..." : "✅ Guardar Notas"}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutNotesModal;
