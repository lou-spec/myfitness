import mongoose from "mongoose";

const AvailabilitySlotSchema = new mongoose.Schema({
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekday: { type: Number, required: true, min: 0, max: 6 }, // 0 = Domingo, 6 = Sábado
  start_time: { type: String, required: true }, // Formato "HH:mm" ex: "09:00"
  end_time: { type: String, required: true },
  recurring: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("AvailabilitySlot", AvailabilitySlotSchema);
