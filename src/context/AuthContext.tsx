import { createContext, useState, useContext } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: () => boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

// USUARIOS

const USERS: (User & { password: string })[] = [
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

// CONTEXTO

export const AuthContext = createContext({} as AuthContextType);

// PROVIDER

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, password: string): boolean => {
    const found = USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// HOOK

export function useAuth() {
  return useContext(AuthContext);
}
