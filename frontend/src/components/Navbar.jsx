import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Gerar iniciais do nome
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <span className="logo-icon">💪</span>
          <span className="logo-text">MyFitness</span>
        </div>

        <div className="navbar-menu">
          <button
            className="navbar-link"
            onClick={() => navigate("/dashboard")}
          >
            📊 Dashboard
          </button>

          {user?.role === "trainer" && (
            <button
              className="navbar-link"
              onClick={() => navigate("/subscription")}
            >
              💳 Pagamentos
            </button>
          )}

          <button className="navbar-link" onClick={() => navigate("/faq")}>
            ❓ FAQ
          </button>

          <button className="navbar-link" onClick={() => navigate("/contact")}>
            📧 Contacto
          </button>
        </div>

        <div className="navbar-user" ref={dropdownRef}>
          <div
            className="user-avatar"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.photo_url ? (
              <img src={user.photo_url} alt={user.name} />
            ) : (
              <div className="avatar-initials">{getInitials(user?.name)}</div>
            )}
          </div>

          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <strong>{user?.name}</strong>
                <span className="user-email">{user?.email}</span>
                <span className="user-role">
                  {user?.role === "trainer" ? "🏋️ Trainer" : "👤 Cliente"}
                </span>
              </div>

              <div className="dropdown-divider"></div>

              {user?.role === "trainer" && (
                <>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/subscription");
                    }}
                  >
                    💳 Minha Subscrição
                  </button>
                  <div className="dropdown-divider"></div>
                </>
              )}

              <button
                className="dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/terms");
                }}
              >
                📄 Termos de Uso
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/privacy");
                }}
              >
                🔒 Privacidade
              </button>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item logout"
                onClick={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
              >
                🚪 Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
