import { useState } from "react";

function PackageForm({ onClose, onSuccess, editPackage = null }) {
  const [title, setTitle] = useState(editPackage?.title || "");
  const [sessionsCount, setSessionsCount] = useState(editPackage?.sessions_count || "");
  const [price, setPrice] = useState(editPackage?.price || "");
  const [description, setDescription] = useState(editPackage?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !sessionsCount || !price) {
      alert("Preenche todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const url = editPackage 
      ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/packages/${editPackage._id}`
      : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/packages";
    
    const method = editPackage ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          sessions_count: parseInt(sessionsCount),
          price: parseFloat(price),
          description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(editPackage ? "Pacote atualizado!" : "Pacote criado!");
        onSuccess();
        onClose();
      } else {
        alert(data.msg || "Erro ao guardar pacote");
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
        <h2>{editPackage ? "✏️ Editar Pacote" : "➕ Novo Pacote"}</h2>
        
        <div className="form-group">
          <label>Título do Pacote *</label>
          <input
            placeholder="Ex: Pacote 10 Sessões"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Número de Sessões *</label>
          <input
            type="number"
            placeholder="Ex: 10"
            value={sessionsCount}
            onChange={(e) => setSessionsCount(e.target.value)}
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Preço (€) *</label>
          <input
            type="number"
            placeholder="Ex: 250"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            placeholder="O que está incluído no pacote..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            {loading ? "A guardar..." : (editPackage ? "✅ Atualizar" : "✅ Criar Pacote")}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageForm;

