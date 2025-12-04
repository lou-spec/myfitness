import express from "express";
import Video from "../models/Video.js";
import auth from "../middleware/auth.js";
import { checkFeature } from "../middleware/planMiddleware.js";

const router = express.Router();

// GET videos do trainer (protegido, apenas Premium)
router.get("/", auth, checkFeature("video_upload"), async (req, res) => {
  try {
    const videos = await Video.find({ trainer_id: req.user.id })
      .sort({ created_at: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar vídeos", error: err.message });
  }
});

// POST criar vídeo (protegido, apenas Premium)
router.post("/", auth, checkFeature("video_upload"), async (req, res) => {
  try {
    const { title, description, videoUrl, category, tags } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ message: "Título e URL são obrigatórios" });
    }

    const video = new Video({
      trainer_id: req.user.id,
      title,
      description,
      videoUrl,
      category: category || "treino",
      tags: tags || [],
    });

    await video.save();
    res.status(201).json({ message: "Vídeo adicionado com sucesso", video });
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar vídeo", error: err.message });
  }
});

// DELETE vídeo
router.delete("/:id", auth, checkFeature("video_upload"), async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      trainer_id: req.user.id,
    });

    if (!video) {
      return res.status(404).json({ message: "Vídeo não encontrado" });
    }

    await Video.deleteOne({ _id: req.params.id });
    res.json({ message: "Vídeo eliminado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao eliminar vídeo", error: err.message });
  }
});

// PUT incrementar visualizações
router.put("/:id/view", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Vídeo não encontrado" });
    }

    video.views += 1;
    await video.save();
    res.json({ views: video.views });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar visualizações" });
  }
});

// GET vídeos públicos de um trainer (para clientes verem)
router.get("/trainer/:trainerId", async (req, res) => {
  try {
    const videos = await Video.find({
      trainer_id: req.params.trainerId,
      isPublic: true,
    }).sort({ created_at: -1 });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar vídeos" });
  }
});

export default router;
