// Configuração da API
// Para desenvolvimento local: http://localhost:5000
// Para produção: Define VITE_API_URL no Vercel com a URL do Render
const API_URL = import.meta.env.VITE_API_URL || 'https://myfitness-pkft.onrender.com';

export default API_URL;
