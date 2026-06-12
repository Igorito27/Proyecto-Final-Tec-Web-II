import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Inicio — TiendaApp</title>
        <meta
          name="description"
          content="Bienvenido a TiendaApp, tu catálogo de productos online."
        />
        <meta property="og:title" content="Inicio — TiendaApp" />
        <meta
          property="og:description"
          content="Bienvenido a TiendaApp, tu catálogo de productos online."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="home">
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
        </section>

        {/* Bienvenida personalizada */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-text">
              <h3>Bienvenido, {user?.name} </h3>
              <p>
                {user?.role === "admin"
                  ? "Tienes acceso completo. Puedes gestionar productos y usuarios desde el menú."
                  : "Explora el catálogo y descubre nuestros productos disponibles."}
              </p>
            </div>
          </div>
        </section>

        {/* Categorías destacadas */}
        <section className="featured-section">
          <div className="section-header">
            <h2>Categorías destacadas</h2>
            <button
              className="link-btn"
              onClick={() => navigate("/categorias")}
            >
              Ver todas →
            </button>
          </div>

          <div className="category-grid">
            <div
              className="category-card"
              onClick={() => navigate("/productos")}
            >
              <span className="category-icon">👔</span>
              <h4>Ropa de hombre</h4>
              <p>Estilo y comodidad</p>
            </div>
            <div
              className="category-card"
              onClick={() => navigate("/productos")}
            >
              <span className="category-icon">👗</span>
              <h4>Ropa de mujer</h4>
              <p>Moda y elegancia</p>
            </div>
            <div
              className="category-card"
              onClick={() => navigate("/productos")}
            >
              <span className="category-icon">💍</span>
              <h4>Joyería</h4>
              <p>Accesorios únicos</p>
            </div>
            <div
              className="category-card"
              onClick={() => navigate("/productos")}
            >
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
    </>
  );
}
