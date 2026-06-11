import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 — Página no encontrada</title>
      </Helmet>

      <div className="notfound-page">
        <div className="notfound-content">
          <span className="notfound-icon">◈</span>
          <h1 className="notfound-codigo">404</h1>
          <h2 className="notfound-titulo">Página no encontrada</h2>
          <p className="notfound-texto">
            La página que buscas no existe o fue movida.
          </p>

          <div className="notfound-acciones">
            <button className="btn-home" onClick={() => navigate("/")}>
              Ir al inicio
            </button>
            <button className="btn-back-nf" onClick={() => navigate(-1)}>
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
