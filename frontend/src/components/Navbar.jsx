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
      <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
        <img src="/myfitness_logo.png" alt="MyFitness" style={{ height: '40px', marginRight: '10px' }} />
        MyFitness
      </div>

      <ul className="navbar-nav">
        <li>
          <a onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer' }}>
            Dashboard
          </a>
        </li>

        {user?.role === "trainer" && (
          <li>
            <a onClick={() => navigate("/subscription")} style={{ cursor: 'pointer' }}>
              Pagamentos
            </a>
          </li>
        )}

        <li>
          <a onClick={() => navigate("/faq")} style={{ cursor: 'pointer' }}>
            FAQ
          </a>
        </li>

        <li>
          <a onClick={() => navigate("/contact")} style={{ cursor: 'pointer' }}>
            Contacto
          </a>
        </li>
      </ul>

      <div className="navbar-user" ref={dropdownRef}>
        <button
          className="navbar-user-button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {user?.photo_url ? (
            <img src={user.photo_url} alt={user.name} className="user-avatar" />
          ) : (
            <div className="avatar-initials">{getInitials(user?.name)}</div>
          )}
          <span>{user?.name?.split(' ')[0]}</span>
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            {user?.role === "trainer" && (
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/subscription");
                }}
              >
                💳 Minha Subscrição
              </button>
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

            <button
              className="dropdown-item"
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
    </nav>
  );
}

export default Navbar;
