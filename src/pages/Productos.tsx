import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Producto } from "../interfaces/Producto";
import { getProductos, getCategorias } from "../services/ProductoService";
import "./Producto.css";

// HELPERS LOCALSTORAGE
const getLocalProductos = (): Producto[] => {
  try {
    const saved = localStorage.getItem("productos_local");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getEliminados = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem("productos_eliminados") || "[]");
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

export default function Productos() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const [apiProductos, cats] = await Promise.all([
          getProductos(),
          getCategorias(),
        ]);

        const locales = getLocalProductos();
        const eliminados = getEliminados();
        const editados = getEditados();

        // Filtrar eliminados de la API
        const apiFiltrados = apiProductos.filter(
          (p) => !eliminados.includes(p.id),
        );

        // Aplicar ediciones sobre los de la API
        const apiConEdiciones = apiFiltrados.map((p) =>
          editados[p.id] ? editados[p.id] : p,
        );

        // Combinar locales primero, luego API
        const combinados = [...locales, ...apiConEdiciones];
        setProductos(combinados);

        // Agregar categorías locales si hay nuevas
        const catsLocales = locales
          .map((p) => p.category)
          .filter((c) => !cats.includes(c));
        setCategorias([...cats, ...new Set(catsLocales)]);
      } catch {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const filtrados = productos.filter((p) => {
    const matchCategoria =
      categoriaActiva === "todas" || p.category === categoriaActiva;
    const matchBusqueda = p.title
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  return (
    <>
      <Helmet>
        <title>Productos — TiendaApp</title>
        <meta
          name="description"
          content="Explora nuestro catálogo completo de productos."
        />
      </Helmet>

      <div className="productos-page">
        <div className="productos-header">
          <div>
            <h1>Productos</h1>
            <p>{filtrados.length} productos encontrados</p>
          </div>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filtros">
          <button
            className={
              categoriaActiva === "todas" ? "filtro-btn active" : "filtro-btn"
            }
            onClick={() => setCategoriaActiva("todas")}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              className={
                categoriaActiva === cat ? "filtro-btn active" : "filtro-btn"
              }
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="productos-estado">
            <div className="spinner" />
            <p>Cargando productos...</p>
          </div>
        )}

        {error && <div className="productos-error">{error}</div>}

        {!loading && !error && (
          <div className="productos-grid">
            {filtrados.map((producto) => (
              <div
                key={producto.id}
                className="producto-card"
                onClick={() => navigate(`/productos/${producto.id}`)}
              >
                <div className="producto-img-wrap">
                  <img
                    src={producto.image}
                    alt={producto.title}
                    className="producto-img"
                  />
                </div>
                <div className="producto-info">
                  <span className="producto-categoria">
                    {producto.category}
                  </span>
                  <h3 className="producto-title">{producto.title}</h3>
                  <div className="producto-footer">
                    <span className="producto-precio">
                      ${producto.price.toFixed(2)}
                    </span>
                    <span className="producto-rating">
                      ⭐ {producto.rating?.rate ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtrados.length === 0 && (
          <div className="productos-estado">
            <p>No se encontraron productos.</p>
          </div>
        )}
      </div>
    </>
  );
}
