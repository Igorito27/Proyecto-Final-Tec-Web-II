import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Productos = lazy(() => import("../pages/Productos"));
const DetalleProducto = lazy(() => import("../pages/DetalleProducto"));
const CrudProductos = lazy(() => import("../pages/CrudProductos"));
const Usuarios = lazy(() => import("../pages/Usuarios"));
const Categorias = lazy(() => import("../pages/Categorias"));
const NotFound = lazy(() => import("../pages/NotFound"));

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
