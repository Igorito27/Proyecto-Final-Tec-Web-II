import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import type { Producto } from "../interfaces/Producto";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/ProductoService";
import "./CrudProductos.css";

type FormData = {
  title: string;
  price: string;
  description: string;
  category: string;
  image: string;
};

const formVacio: FormData = {
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
};

const STORAGE_KEY = "productos_local";

// HELPERS LOCALSTORAGE
const getLocalProductos = (): Producto[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocalProductos = (productos: Producto[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
};

export default function CrudProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<FormData>(formVacio);
  const [formError, setFormError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  // CARGAR — API + localStorage combinados
  useEffect(() => {
    const cargar = async () => {
      try {
        const apiProductos = await getProductos();
        const locales = getLocalProductos();

        // IDs eliminados guardados
        const eliminados: number[] = JSON.parse(
          localStorage.getItem("productos_eliminados") || "[]",
        );

        // Filtrar eliminados de la API
        const apiFiltrados = apiProductos.filter(
          (p) => !eliminados.includes(p.id),
        );

        // Productos editados localmente
        const editados: Record<number, Producto> = JSON.parse(
          localStorage.getItem("productos_editados") || "{}",
        );

        // Aplicar ediciones sobre los de la API
        const apiConEdiciones = apiFiltrados.map((p) =>
          editados[p.id] ? editados[p.id] : p,
        );

        // Combinar: primero los nuevos locales, luego los de la API
        const combinados = [...locales, ...apiConEdiciones];
        setProductos(combinados);
      } catch {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // TOAST
  const mostrarToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // MODAL
  const abrirCrear = () => {
    setEditando(null);
    setForm(formVacio);
    setFormError("");
    setModalAbierto(true);
  };

  const abrirEditar = (producto: Producto) => {
    setEditando(producto);
    setForm({
      title: producto.title,
      price: String(producto.price),
      description: producto.description,
      category: producto.category,
      image: producto.image,
    });
    setFormError("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setForm(formVacio);
    setFormError("");
  };

  // VALIDACIONES
  const validar = (): boolean => {
    if (!form.title.trim() || form.title.trim().length < 3) {
      setFormError("El título debe tener al menos 3 caracteres.");
      return false;
    }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setFormError("El precio debe ser un número mayor a 0.");
      return false;
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      setFormError("La descripción debe tener al menos 10 caracteres.");
      return false;
    }
    if (!form.category.trim()) {
      setFormError("La categoría es obligatoria.");
      return false;
    }
    if (!form.image.trim()) {
      setFormError("La imagen es obligatoria.");
      return false;
    }
    return true;
  };

  // GUARDAR
  const guardar = async () => {
    setFormError("");
    if (!validar()) return;

    setGuardando(true);

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      category: form.category.trim(),
      image: form.image.trim(),
    };

    try {
      if (editando) {
        await updateProducto(editando.id, payload);

        const productoActualizado: Producto = {
          ...editando,
          ...payload,
        };

        // Si es un producto local (id > 100000), actualizar en locales
        const locales = getLocalProductos();
        const esLocal = locales.some((p) => p.id === editando.id);

        if (esLocal) {
          const nuevosLocales = locales.map((p) =>
            p.id === editando.id ? productoActualizado : p,
          );
          saveLocalProductos(nuevosLocales);
        } else {
          // Guardar edición de producto de la API
          const editados = JSON.parse(
            localStorage.getItem("productos_editados") || "{}",
          );
          editados[editando.id] = productoActualizado;
          localStorage.setItem("productos_editados", JSON.stringify(editados));
        }

        setProductos((prev) =>
          prev.map((p) => (p.id === editando.id ? productoActualizado : p)),
        );
        mostrarToast("Producto actualizado correctamente.");
      } else {
        await createProducto(payload);

        // Crear con ID único local
        const nuevoProducto: Producto = {
          ...payload,
          id: Date.now(),
          rating: { rate: 0, count: 0 },
        };

        const locales = getLocalProductos();
        saveLocalProductos([nuevoProducto, ...locales]);

        setProductos((prev) => [nuevoProducto, ...prev]);
        mostrarToast("Producto creado correctamente.");
      }

      cerrarModal();
    } catch {
      setFormError("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  // ELIMINAR

  const eliminar = async (id: number) => {
    try {
      await deleteProducto(id);

      const locales = getLocalProductos();
      const esLocal = locales.some((p) => p.id === id);

      if (esLocal) {
        // Eliminar de locales
        const nuevosLocales = locales.filter((p) => p.id !== id);
        saveLocalProductos(nuevosLocales);
      } else {
        // Marcar como eliminado para no mostrarlo al recargar
        const eliminados: number[] = JSON.parse(
          localStorage.getItem("productos_eliminados") || "[]",
        );
        eliminados.push(id);
        localStorage.setItem(
          "productos_eliminados",
          JSON.stringify(eliminados),
        );

        // Limpiar de editados si existía
        const editados = JSON.parse(
          localStorage.getItem("productos_editados") || "{}",
        );
        delete editados[id];
        localStorage.setItem("productos_editados", JSON.stringify(editados));
      }

      setProductos((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
      mostrarToast("Producto eliminado correctamente.");
    } catch {
      mostrarToast("Error al eliminar el producto.");
    }
  };

  // RENDER
  return (
    <>
      <Helmet>
        <title>Gestión de Productos — TiendaApp</title>
        <meta
          name="description"
          content="Panel de administración de productos."
        />
        <meta property="og:title" content="Gestión de Productos — TiendaApp" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="crud-page">
        <div className="crud-header">
          <div>
            <h1>Gestión de Productos</h1>
            <p>{productos.length} productos en total</p>
          </div>
          <button className="btn-nuevo" onClick={abrirCrear}>
            + Nuevo producto
          </button>
        </div>

        {loading && (
          <div className="crud-estado">
            <div className="spinner" />
            <p>Cargando productos...</p>
          </div>
        )}

        {error && <div className="crud-error">{error}</div>}

        {!loading && !error && (
          <div className="tabla-wrap">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Rating</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <div className="tabla-img-wrap">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="tabla-img"
                          width={40}
                          height={40}
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td>
                      <p className="tabla-titulo">{prod.title}</p>
                    </td>
                    <td>
                      <span className="tabla-categoria">{prod.category}</span>
                    </td>
                    <td>
                      <span className="tabla-precio">
                        ${prod.price.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="tabla-rating">
                        ⭐ {prod.rating?.rate ?? "—"}
                      </span>
                    </td>
                    <td>
                      <div className="tabla-acciones">
                        <button
                          className="btn-editar"
                          onClick={() => abrirEditar(prod)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => setConfirmId(prod.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal crear/editar */}
        {modalAbierto && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editando ? "Editar producto" : "Nuevo producto"}</h3>
                <button className="modal-close" onClick={cerrarModal}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Precio *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoría *</label>
                    <input
                      type="text"
                      placeholder="Ej: electronics"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    placeholder="Descripción del producto"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>URL de imagen *</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                </div>

                {formError && <div className="form-error">{formError}</div>}
              </div>

              <div className="modal-footer">
                <button className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button
                  className="btn-guardar"
                  onClick={guardar}
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : editando
                      ? "Actualizar"
                      : "Crear"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal confirmar eliminar */}
        {confirmId !== null && (
          <div className="modal-overlay" onClick={() => setConfirmId(null)}>
            <div
              className="modal modal-confirm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Eliminar producto</h3>
                <button
                  className="modal-close"
                  onClick={() => setConfirmId(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <p className="confirm-texto">
                  ¿Estás seguro que deseas eliminar este producto? Esta acción
                  no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-cancelar"
                  onClick={() => setConfirmId(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn-eliminar-confirm"
                  onClick={() => eliminar(confirmId)}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
