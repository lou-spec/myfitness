import { useState } from "react";

function CancellationModal({ appointment, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Por favor, indica o motivo do cancelamento.");
      return;
    }
    onConfirm(reason);
  };

  const appointmentDate = new Date(appointment.start_datetime);
  const formattedDate = appointmentDate.toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <h2>⚠️ Cancelar Sessão</h2>
        
        <div style={{ 
          background: "rgba(255, 193, 7, 0.1)", 
          padding: "15px", 
          borderRadius: "8px",
          border: "1px solid rgba(255, 193, 7, 0.3)",
          marginBottom: "20px"
        }}>
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>📅 Sessão a cancelar:</p>
          <p style={{ margin: "4px 0", opacity: 0.9 }}>📆 {formattedDate}</p>
          <p style={{ margin: "4px 0", opacity: 0.9 }}>🕐 {formattedTime}</p>
        </div>

        <div className="form-group">
          <label>Motivo do cancelamento *</label>
          <textarea
            placeholder="Explica o motivo do cancelamento... (Ex: Compromisso inesperado, doença, etc.)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(0, 0, 0, 0.3)",
              color: "white",
              fontSize: "14px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
          <p style={{ 
            fontSize: "12px", 
            opacity: 0.7, 
            marginTop: "8px",
            fontStyle: "italic" 
          }}>
            ℹ️ O teu personal trainer será notificado por email com este motivo
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button 
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(255, 50, 50, 0.3)",
              border: "1px solid rgba(255, 50, 50, 0.5)",
              color: "white",
              fontWeight: "bold"
            }}
          >
            ✅ Confirmar Cancelamento
          </button>
          <button 
            className="btn-secondary" 
            onClick={onClose}
            style={{ flex: 1 }}
          >
            ❌ Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancellationModal;

