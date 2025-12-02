import { useState } from "react";

function ProfileEditModal({ user, onClose, onSuccess }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [city, setCity] = useState(user.city || "");
  const [bio, setBio] = useState(user.bio || "");
  const [specialties, setSpecialties] = useState(user.specialties?.join(", ") || "");
  const [pricePerSession, setPricePerSession] = useState(user.price_per_session || "");
  const [photoUrl, setPhotoUrl] = useState(user.photo_url || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
          city,
          bio,
          specialties: specialties.split(",").map(s => s.trim()).filter(Boolean),
          price_per_session: parseFloat(pricePerSession) || 0,
          photo_url: photoUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Perfil atualizado!");
        onSuccess(data);
        onClose();
      } else {
        alert(data.msg || "Erro ao atualizar perfil");
      }
    } catch (err) {
      alert("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <h2>✏️ Editar Perfil</h2>
        
        <div className="form-group">
          <label>Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Telemóvel</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="912 345 678"
          />
        </div>

        <div className="form-group">
          <label>Cidade</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Lisboa, Porto..."
          />
        </div>

        <div className="form-group">
          <label>URL da Foto</label>
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Apresenta-te aos teus clientes..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Especialidades (separadas por vírgula)</label>
          <input
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            placeholder="Ex: Musculação, Emagrecimento, Hipertrofia"
          />
        </div>

        <div className="form-group">
          <label>Preço por Sessão (€)</label>
          <input
            type="number"
            value={pricePerSession}
            onChange={(e) => setPricePerSession(e.target.value)}
            placeholder="50"
            min="0"
            step="0.01"
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            {loading ? "A guardar..." : "✅ Guardar"}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal;

