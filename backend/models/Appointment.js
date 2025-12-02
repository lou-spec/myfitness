import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  client_name: { type: String, required: true },
  client_email: { type: String, required: true },
  client_phone: String,
  start_datetime: { type: Date, required: true },
  end_datetime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["booked", "cancelled", "done", "no-show"], 
    default: "booked" 
  },
  payment_status: { 
    type: String, 
    enum: ["pending", "paid", "refunded"], 
    default: "pending" 
  },
  payment_id: String,
  notes: String,
  workout_notes: String, // Notas do treino adicionadas pelo trainer após a sessão
  client_rating: { type: Number, min: 1, max: 5 }, // Avaliação do cliente
  client_feedback: String, // Feedback do cliente
  cancellation_reason: String, // Motivo do cancelamento (quando cliente cancela)
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Appointment", AppointmentSchema);
