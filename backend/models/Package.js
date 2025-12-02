import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  sessions_count: { type: Number, required: true },
  price: { type: Number, required: true },
  description: String,
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Package", PackageSchema);
