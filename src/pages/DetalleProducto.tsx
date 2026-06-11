import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Producto } from "../interfaces/Producto";
import { getProductoById } from "../services/ProductoService";
import "./DetalleProducto.css";

// ==========================================
// HELPERS LOCALSTORAGE
// ==========================================

const getLocalProductos = (): Producto[] => {
  try {
    const saved = localStorage.getItem("productos_local");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getEditados = (): Record<number, Producto> => {
  try {
    return JSON.parse(localStorage.getItem("productos_editados") || "{}");
  } catch {
    return {};
  }
};

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const numId = Number(id);

      // Buscar primero en locales
      const locales = getLocalProductos();
      const local = locales.find((p) => p.id === numId);
      if (local) {
        setProducto(local);
        setLoading(false);
        return;
      }

      // Buscar en editados
      const editados = getEditados();
      if (editados[numId]) {
        setProducto(editados[numId]);
        setLoading(false);
        return;
      }

      // Si no está en local, buscar en la API
      try {
        const data = await getProductoById(numId);
        setProducto(data);
      } catch {
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  if (loading) {
    return (
      <div className="detalle-estado">
        <div className="spinner" />
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="detalle-estado">
        <p className="detalle-error">{error || "Producto no encontrado."}</p>
        <button className="btn-back" onClick={() => navigate("/productos")}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  const estrellas = Math.round(producto.rating?.rate ?? 0);

  return (
    <>
      <Helmet>
        <title>
          {producto ? `${producto.title} — TiendaApp` : "Producto — TiendaApp"}
        </title>
        <meta
          name="description"
          content={
            producto
              ? producto.description.slice(0, 150)
              : "Detalle de producto en TiendaApp."
          }
        />
        <meta
          property="og:title"
          content={
            producto ? `${producto.title} — TiendaApp` : "Producto — TiendaApp"
          }
        />
        <meta
          property="og:description"
          content={
            producto
              ? producto.description.slice(0, 150)
              : "Detalle de producto en TiendaApp."
          }
        />
        <meta property="og:image" content={producto?.image ?? ""} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="detalle-page">
        <button className="btn-back" onClick={() => navigate("/productos")}>
          ← Volver
        </button>

        <div className="detalle-contenido">
          <div className="detalle-img-wrap">
            <img
              src={producto.image}
              alt={producto.title}
              className="detalle-img"
              width={300}
              height={300}
            />
          </div>

          <div className="detalle-info">
            <span className="detalle-categoria">{producto.category}</span>

            <h1 className="detalle-titulo">{producto.title}</h1>

            <div className="detalle-rating">
              <div className="estrellas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < estrellas ? "estrella activa" : "estrella"}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-texto">
                {producto.rating?.rate ?? 0} / 5 — {producto.rating?.count ?? 0}{" "}
                reseñas
              </span>
            </div>

            <div className="detalle-precio">${producto.price.toFixed(2)}</div>

            <div className="detalle-descripcion">
              <h4>Descripción</h4>
              <p>{producto.description}</p>
            </div>

            <div className="detalle-badges">
              <span className="badge-item">✦ Envío gratis</span>
              <span className="badge-item">✦ Stock disponible</span>
              <span className="badge-item">✦ Garantía incluida</span>
            </div>

            <div className="detalle-acciones">
              <button className="btn-primary-detalle">
                Agregar al carrito
              </button>
              <button
                className="btn-secondary-detalle"
                onClick={() => navigate("/productos")}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
