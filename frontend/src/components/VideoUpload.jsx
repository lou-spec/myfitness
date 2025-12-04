import { useState } from "react";

function VideoUpload({ user }) {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "treino",
    videoUrl: ""
  });

  const categories = [
    { value: "treino", label: "🏋️ Treino" },
    { value: "nutricao", label: "🥗 Nutrição" },
    { value: "dicas", label: "💡 Dicas" },
    { value: "alongamento", label: "🧘 Alongamento" },
    { value: "cardio", label: "🏃 Cardio" },
    { value: "outro", label: "📹 Outro" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://myfitness-pkft.onrender.com/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Vídeo adicionado com sucesso!");
        setFormData({ title: "", description: "", category: "treino", videoUrl: "" });
        setShowUploadForm(false);
        fetchVideos();
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao adicionar vídeo");
      }
    } catch (error) {
      alert("Erro ao conectar ao servidor");
    } finally {
      setUploading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://myfitness-pkft.onrender.com/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
    }
  };

  const deleteVideo = async (videoId) => {
    if (!confirm("Tens a certeza que queres eliminar este vídeo?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://myfitness-pkft.onrender.com/api/videos/${videoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Vídeo eliminado!");
        fetchVideos();
      }
    } catch (error) {
      alert("Erro ao eliminar vídeo");
    }
  };

  useState(() => {
    fetchVideos();
  }, []);

  return (
    <div className="video-upload-section">
      <div className="section-header">
        <h2>📹 Biblioteca de Vídeos</h2>
        <button className="btn-primary" onClick={() => setShowUploadForm(!showUploadForm)}>
          {showUploadForm ? "❌ Cancelar" : "➕ Adicionar Vídeo"}
        </button>
      </div>

      {showUploadForm && (
        <div className="video-form">
          <h3>Adicionar Novo Vídeo</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Título do vídeo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Descrição (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              required
            />
            <div className="help-text">
              💡 Cole o link do YouTube ou outro serviço de vídeo
            </div>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? "A adicionar..." : "✅ Adicionar Vídeo"}
            </button>
          </form>
        </div>
      )}

      <div className="videos-grid">
        {videos.length === 0 ? (
          <div className="empty-state">
            <p>📹 Ainda não tens vídeos. Adiciona o primeiro!</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-thumbnail">
                {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(video.videoUrl)}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video controls>
                    <source src={video.videoUrl} />
                  </video>
                )}
              </div>
              <div className="video-info">
                <span className="video-category">{categories.find(c => c.value === video.category)?.label}</span>
                <h3>{video.title}</h3>
                {video.description && <p>{video.description}</p>}
                <div className="video-meta">
                  <span>👁️ {video.views || 0} visualizações</span>
                  <span>📅 {new Date(video.created_at).toLocaleDateString('pt-PT')}</span>
                </div>
                <button className="btn-danger" onClick={() => deleteVideo(video._id)}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper para extrair ID do YouTube
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default VideoUpload;
