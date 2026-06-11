import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Navbar.css";
import { routes } from "../data/Routes";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleRoutes = routes.filter((r) => {
    if (r.hideInNav) return false;
    if (r.adminOnly && !isAdmin()) return false;
    return true;
  });

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">◈</span>
          <span className="brand-name">TiendaApp</span>
        </Link>
      </div>

      <ul className="navbar-links">
        {visibleRoutes.map((route, index) => (
          <li key={index}>
            <Link
              to={route.path}
              className={location.pathname === route.path ? "active" : ""}
            >
              {route.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="navbar-user">
        {user ? (
          <>
            <div className="user-pill">
              <span className={`role-dot ${user.role}`} />
              <span>{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
