import "./App.css";
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { routes } from "./data/Routes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./componets/Layout";

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid #e8e4df",
          borderTopColor: "#c9a96e",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}

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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
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
