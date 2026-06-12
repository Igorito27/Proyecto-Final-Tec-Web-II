import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Credenciales inválidas.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>Iniciar sesión — TiendaApp</title>
        <meta
          name="description"
          content="Inicia sesión en TiendaApp para acceder al catálogo de productos."
        />
        <meta property="og:title" content="Iniciar sesión — TiendaApp" />
        <meta
          property="og:description"
          content="Inicia sesión en TiendaApp para acceder al catálogo de productos."
        />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="login-page">
        <div className="login-left">
          <div className="login-left-content">
            <span className="login-brand-icon">◈</span>
            <h1>TiendaApp</h1>
            <p>Descubre productos únicos, gestiona tu catálogo y más.</p>

            <div className="login-features">
              <div className="feature-item">
                <span>✦</span>
                <p>Catálogo completo de productos</p>
              </div>
              <div className="feature-item">
                <span>✦</span>
                <p>Gestión por roles de usuario</p>
              </div>
              <div className="feature-item">
                <span>✦</span>
                <p>Interfaz moderna y elegante</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="login-right">
          <div className="login-box">
            <div className="login-header">
              <h2>Bienvenido</h2>
              <p>Ingresa tus datos para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

            {/*<div className="login-hints">
              <p className="hints-title">Usuarios de prueba</p>
              <div
                className="hint-item"
                onClick={() => {
                  setEmail("admin@tienda.com");
                  setPassword("admin123");
                }}
              >
                <span className="hint-dot admin" />
                <div>
                  <p>admin@tienda.com</p>
                  <p>admin123 — Administrador</p>
                </div>
              </div>
              <div
                className="hint-item"
                onClick={() => {
                  setEmail("juan@tienda.com");
                  setPassword("user123");
                }}
              >
                <span className="hint-dot user" />
                <div>
                  <p>juan@tienda.com</p>
                  <p>user123 — Usuario</p>
                </div>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
    </>
  );
}
