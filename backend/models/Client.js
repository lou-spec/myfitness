import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  notes: String,
  medical_info: String,
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Client", ClientSchema);
