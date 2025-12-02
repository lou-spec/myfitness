import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/myfitness")
  .then(async () => {
    console.log("✅ MongoDB conectado");
    
    const result = await mongoose.connection.db.collection('users').deleteMany({ slug: null });
    console.log(`🗑️  Removidos ${result.deletedCount} utilizadores com slug null`);
    
    await mongoose.disconnect();
    console.log("✅ Limpeza concluída");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Erro:", err);
    process.exit(1);
  });
