import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["trainer", "client"], default: "client" },
  phone: String,
  // Campos apenas para trainers
  photo_url: String,
  city: String,
  specialties: [String],
  bio: String,
  price_per_session: { type: Number, default: 0 },
  currency: { type: String, default: "EUR" },
  slug: { type: String, unique: true, sparse: true },
  // Sistema de subscrição (apenas trainers)
  subscription_plan: { 
    type: String, 
    enum: ["basic", "pro", "premium", "trial"], 
    default: "trial" 
  },
  trial_start_date: { type: Date },
  trial_end_date: { type: Date },
  subscription_active: { type: Boolean, default: true },
  trial_warning_sent: { type: Boolean, default: false }, // Flag para email de aviso 13 dias
  // Stripe integration fields
  subscription_stripe_id: { type: String }, // Stripe subscription ID
  subscription_customer_id: { type: String }, // Stripe customer ID
  subscription_current_period_end: { type: Date }, // When current billing period ends
  subscription_cancel_at_period_end: { type: Boolean, default: false }, // If user cancelled but subscription still active
  // Campos apenas para clientes
  trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
});

// Gerar slug automaticamente antes de salvar
UserSchema.pre('save', function(next) {
  if (this.role === 'trainer' && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.model("User", UserSchema);
