import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";
import Layout from "./componets/Layout";
import Login from "./pages/Login";
import { routes } from "./data/Routes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NotFound from "./pages/NotFound";

// RUTA PROTEGIDA
type ProtectedProps = {
  element: React.ReactElement;
  adminOnly?: boolean;
};

function ProtectedRoute({ element, adminOnly }: ProtectedProps) {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin()) return <Navigate to="/" replace />;

  return element;
}

// APP
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          {routes
            .filter((r) => r.path !== "*")
            .map((route, index) => (
              <Route
                key={index}
                index={route.path === "/"}
                path={route.path === "/" ? undefined : route.path.slice(1)}
                element={
                  <ProtectedRoute
                    element={route.element}
                    adminOnly={route.adminOnly}
                  />
                }
              />
            ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HelmetProvider>
  );
}
