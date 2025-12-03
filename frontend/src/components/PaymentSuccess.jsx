import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95), rgba(30, 30, 30, 0.95))',
        padding: '3rem',
        borderRadius: '16px',
        border: '2px solid rgba(220, 20, 60, 0.3)',
        boxShadow: '0 10px 40px rgba(220, 20, 60, 0.2)'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '1rem',
          animation: 'bounce 0.6s ease'
        }}>
          ✅
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #dc143c, #ff0000)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Pagamento Confirmado!
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          O teu pagamento foi processado com sucesso. <br />
          A tua subscrição está ativa e podes usar todas as funcionalidades do plano escolhido.
        </p>

        <div style={{
          background: 'rgba(220, 20, 60, 0.1)',
          border: '1px solid rgba(220, 20, 60, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Receberás um email de confirmação em breve com os detalhes da tua subscrição.
          </p>
        </div>

        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '2rem'
        }}>
          Serás redirecionado para o dashboard em {countdown} segundos...
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #dc143c, #ff0000)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(220, 20, 60, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(220, 20, 60, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(220, 20, 60, 0.3)';
          }}
        >
          Ir para Dashboard Agora →
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

export default PaymentSuccess;
