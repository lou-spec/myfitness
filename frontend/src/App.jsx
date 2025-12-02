import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import TrainerDashboard from "./components/TrainerDashboard";
import ClientDashboard from "./components/ClientDashboard";

function App({ page: initialPage }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(initialPage || "login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      if (location.pathname !== "/dashboard") {
        navigate("/dashboard");
      }
    } else if (location.pathname === "/dashboard") {
      navigate("/login");
    }
  }, [navigate, location]);

  // Atualiza página baseado na rota
  useEffect(() => {
    if (location.pathname === "/login") setPage("login");
    else if (location.pathname === "/register") setPage("register");
  }, [location]);

  const handleSetPage = (newPage) => {
    setPage(newPage);
    navigate(`/${newPage}`);
  };

  if (user && location.pathname === "/dashboard") {
    // Renderiza dashboard baseado no role do utilizador
    if (user.role === "client") {
      return <ClientDashboard user={user} setUser={setUser} />;
    }
    return <TrainerDashboard user={user} setUser={setUser} />;
  }

  return (
    <div className="container">
      {page === "login" ? (
        <Login setPage={handleSetPage} setUser={setUser} />
      ) : (
        <Register setPage={handleSetPage} />
      )}
    </div>
  );
}

export default App;
