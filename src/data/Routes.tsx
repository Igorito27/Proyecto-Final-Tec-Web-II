import Home from "../pages/Home";
import Productos from "../pages/Productos";
import DetalleProducto from "../pages/DetalleProducto";
import CrudProductos from "../pages/CrudProductos";
import Usuarios from "../pages/Usuarios";
import Categorias from "../pages/Categorias";
import NotFound from "../pages/NotFound";

export type AppRoute = {
  name: string;
  path: string;
  element: React.ReactElement;
  adminOnly?: boolean;
  hideInNav?: boolean;
};

export const routes: AppRoute[] = [
  {
    name: "Inicio",
    path: "/",
    element: <Home />,
  },
  {
    name: "Productos",
    path: "/productos",
    element: <Productos />,
  },
  {
    name: "Detalle",
    path: "/productos/:id",
    element: <DetalleProducto />,
    hideInNav: true,
  },
  {
    name: "Categorías",
    path: "/categorias",
    element: <Categorias />,
  },
  {
    name: "CRUD Productos",
    path: "/crud-productos",
    element: <CrudProductos />,
    adminOnly: true,
  },
  {
    name: "Usuarios",
    path: "/usuarios",
    element: <Usuarios />,
    adminOnly: true,
  },
  {
    name: "404",
    path: "*",
    element: <NotFound />,
    hideInNav: true,
  },
];
