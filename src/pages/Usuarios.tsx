import { Helmet } from "react-helmet-async";
import "./Usuarios.css";

type Usuario = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  password: string;
};

const USUARIOS: Usuario[] = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@tienda.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan@tienda.com",
    password: "user123",
    role: "user",
  },
  {
    id: 3,
    name: "María López",
    email: "maria@tienda.com",
    password: "user123",
    role: "user",
  },
];

const totalAdmins = USUARIOS.filter((u) => u.role === "admin").length;
const totalUsuarios = USUARIOS.filter((u) => u.role === "user").length;

export default function Usuarios() {
  return (
    <>
      <Helmet>
        <title>Usuarios — TiendaApp</title>
        <meta
          name="description"
          content="Gestión de usuarios del sistema TiendaApp."
        />
        <meta property="og:title" content="Usuarios — TiendaApp" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="usuarios-page">
        {/* Encabezado */}
        <div className="usuarios-header">
          <div>
            <h1>Usuarios</h1>
            <p>{USUARIOS.length} usuarios registrados</p>
          </div>
        </div>

        {/* Resumen */}
        <div className="usuarios-resumen">
          <div className="resumen-card">
            <span className="resumen-numero">{USUARIOS.length}</span>
            <span className="resumen-label">Total usuarios</span>
          </div>
          <div className="resumen-card">
            <span className="resumen-numero admin">{totalAdmins}</span>
            <span className="resumen-label">Administradores</span>
          </div>
          <div className="resumen-card">
            <span className="resumen-numero user">{totalUsuarios}</span>
            <span className="resumen-label">Usuarios regulares</span>
          </div>
        </div>

        {/* Tabla */}
        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Contraseña</th>
                <th>Rol</th>
                <th>Permisos</th>
              </tr>
            </thead>
            <tbody>
              {USUARIOS.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <span className="usuario-id">#{usuario.id}</span>
                  </td>
                  <td>
                    <div className="usuario-nombre-wrap">
                      <div className={`usuario-avatar ${usuario.role}`}>
                        {usuario.name.charAt(0)}
                      </div>
                      <span className="usuario-nombre">{usuario.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="usuario-email">{usuario.email}</span>
                  </td>
                  <td>
                    <span className="usuario-password">{usuario.password}</span>
                  </td>
                  <td>
                    <span className={`rol-badge ${usuario.role}`}>
                      {usuario.role === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </td>
                  <td>
                    <div className="permisos">
                      {usuario.role === "admin" ? (
                        <>
                          <span className="permiso si">Ver</span>
                          <span className="permiso si">Crear</span>
                          <span className="permiso si">Editar</span>
                          <span className="permiso si">Eliminar</span>
                        </>
                      ) : (
                        <>
                          <span className="permiso si">Ver</span>
                          <span className="permiso no">Crear</span>
                          <span className="permiso no">Editar</span>
                          <span className="permiso no">Eliminar</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info de roles */}
        <div className="roles-info">
          <div className="rol-info-card">
            <div className="rol-info-header">
              <span className="rol-dot admin" />
              <h3>Administrador</h3>
            </div>
            <ul className="rol-permisos-lista">
              <li>✦ Acceso completo al sistema</li>
              <li>✦ Gestión de productos (CRUD)</li>
              <li>✦ Visualización de usuarios</li>
              <li>✦ Acceso a todas las páginas</li>
            </ul>
          </div>
          <div className="rol-info-card">
            <div className="rol-info-header">
              <span className="rol-dot user" />
              <h3>Usuario regular</h3>
            </div>
            <ul className="rol-permisos-lista">
              <li>✦ Ver catálogo de productos</li>
              <li>✦ Ver detalle de productos</li>
              <li>✦ Explorar categorías</li>
              <li className="no-permitido">✕ Sin acceso a CRUD</li>
              <li className="no-permitido">✕ Sin acceso a usuarios</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
