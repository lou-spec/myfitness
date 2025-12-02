import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "EUR" },
  stripe_charge_id: String,
  status: { 
    type: String, 
    enum: ["pending", "succeeded", "failed", "refunded"], 
    default: "pending" 
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", PaymentSchema);
