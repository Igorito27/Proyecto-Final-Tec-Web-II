import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  getCategorias,
  getProductosByCategoria,
} from "../services/ProductoService";
import type { Producto } from "../interfaces/Producto";
import "./Categorias.css";

// Iconos y descripciones por categoría
const categoriaInfo: Record<string, { icon: string; descripcion: string }> = {
  "men's clothing": {
    icon: "👔",
    descripcion: "Ropa moderna y cómoda para hombre.",
  },
  "women's clothing": {
    icon: "👗",
    descripcion: "Moda femenina con estilo y elegancia.",
  },
  jewelery: {
    icon: "💍",
    descripcion: "Accesorios y joyas únicos.",
  },
  electronics: {
    icon: "📱",
    descripcion: "Tecnología y gadgets de última generación.",
  },
};

export default function Categorias() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<string[]>([]);
  const [previews, setPreviews] = useState<Record<string, Producto[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const cats = await getCategorias();
        setCategorias(cats);

        const previewsData: Record<string, Producto[]> = {};
        await Promise.all(
          cats.map(async (cat) => {
            const prods = await getProductosByCategoria(cat);
            previewsData[cat] = prods.slice(0, 3);
          }),
        );
        setPreviews(previewsData);
      } catch {
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <>
      <Helmet>
        <title>Categorías — TiendaApp</title>
        <meta
          name="description"
          content="Explora productos por categoría: ropa, joyería y electrónica."
        />
        <meta property="og:title" content="Categorías — TiendaApp" />
        <meta
          property="og:description"
          content="Explora productos por categoría en TiendaApp."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="categorias-page">
        {/* Encabezado */}
        <div className="categorias-header">
          <h1>Categorías</h1>
          <p>Encuentra exactamente lo que buscas</p>
        </div>

        {/* Estados */}
        {loading && (
          <div className="categorias-estado">
            <div className="spinner" />
            <p>Cargando categorías...</p>
          </div>
        )}

        {error && <div className="categorias-error">{error}</div>}

        {/* Lista de categorías */}
        {!loading && !error && (
          <div className="categorias-lista">
            {categorias.map((cat) => {
              const info = categoriaInfo[cat] ?? {
                icon: "📦",
                descripcion: "",
              };
              const prods = previews[cat] ?? [];

              return (
                <div key={cat} className="categoria-seccion">
                  {/* Cabecera de categoría */}
                  <div className="categoria-cabecera">
                    <div className="categoria-cabecera-left">
                      <span className="categoria-icono">{info.icon}</span>
                      <div>
                        <h2 className="categoria-nombre">{cat}</h2>
                        <p className="categoria-desc">{info.descripcion}</p>
                      </div>
                    </div>
                    <button
                      className="ver-todos-btn"
                      onClick={() => navigate("/productos")}
                    >
                      Ver todos →
                    </button>
                  </div>

                  {/* Preview de productos */}
                  <div className="categoria-preview">
                    {prods.map((prod) => (
                      <div
                        key={prod.id}
                        className="preview-card"
                        onClick={() => navigate(`/productos/${prod.id}`)}
                      >
                        <div className="preview-img-wrap">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="preview-img"
                            width={110}
                            height={110}
                            loading="lazy"
                          />
                        </div>
                        <div className="preview-info">
                          <p className="preview-title">{prod.title}</p>
                          <span className="preview-precio">
                            ${prod.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
