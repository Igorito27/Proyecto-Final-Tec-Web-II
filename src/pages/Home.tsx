import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <span className="hero-tag">Catálogo de Productos</span>
          <h1>
            Encuentra lo que <br />
            <span className="hero-highlight">estás buscando</span>
          </h1>
          <p>
            Explora nuestra selección de productos organizados por categorías.
            Calidad y variedad en un solo lugar.
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/productos")}
            >
              Ver productos
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/categorias")}
            >
              Ver categorías
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card floating">
            <span className="hero-card-icon">🛍️</span>
            <p>+20 productos</p>
          </div>
          <br />
          <div className="hero-card floating delay-1">
            <span className="hero-card-icon">📦</span>
            <p>4 categorías</p>
          </div>
          <br />
          <div className="hero-card floating delay-2">
            <span className="hero-card-icon">⭐</span>
            <p>Mejor calidad</p>
          </div>
        </div>
      </section>

      {/* Bienvenida personalizada */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-text">
            <h3>Hola, {user?.name} 👋</h3>
            <p>
              {user?.role === "admin"
                ? "Tienes acceso completo. Puedes gestionar productos y usuarios desde el menú."
                : "Explora el catálogo y descubre nuestros productos disponibles."}
            </p>
          </div>
          <span className={`welcome-badge ${user?.role}`}>
            {user?.role === "admin" ? "Administrador" : "Usuario"}
          </span>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Categorías destacadas</h2>
          <button className="link-btn" onClick={() => navigate("/categorias")}>
            Ver todas →
          </button>
        </div>

        <div className="category-grid">
          <div className="category-card" onClick={() => navigate("/productos")}>
            <span className="category-icon">👔</span>
            <h4>Ropa de hombre</h4>
            <p>Estilo y comodidad</p>
          </div>
          <div className="category-card" onClick={() => navigate("/productos")}>
            <span className="category-icon">👗</span>
            <h4>Ropa de mujer</h4>
            <p>Moda y elegancia</p>
          </div>
          <div className="category-card" onClick={() => navigate("/productos")}>
            <span className="category-icon">💍</span>
            <h4>Joyería</h4>
            <p>Accesorios únicos</p>
          </div>
          <div className="category-card" onClick={() => navigate("/productos")}>
            <span className="category-icon">📱</span>
            <h4>Electrónica</h4>
            <p>Tecnología de punta</p>
          </div>
        </div>
      </section>

      {/* CTA admin */}
      {user?.role === "admin" && (
        <section className="admin-cta">
          <div className="admin-cta-text">
            <h3>Panel de administración</h3>
            <p>Gestiona productos y usuarios desde aquí.</p>
          </div>
          <div className="admin-cta-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/crud-productos")}
            >
              Gestionar productos
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/usuarios")}
            >
              Ver usuarios
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
