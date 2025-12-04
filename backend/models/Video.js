import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["treino", "nutricao", "dicas", "alongamento", "cardio", "outro"],
    default: "treino",
  },
  views: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
  },
  duration: {
    type: Number, // em segundos
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

videoSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
