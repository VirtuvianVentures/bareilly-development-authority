import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "superadmin" | "admin" | "officer" | "user";

export interface AuthUser {
  userId: number;
  username: string;
  name: string;
  role: UserRole;
  department?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function parseJwt(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { userId: payload.userId, username: payload.username, name: payload.name, role: payload.role, department: payload.department };
  } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("bda_token"));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const t = localStorage.getItem("bda_token");
    return t ? parseJwt(t) : null;
  });

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Login failed");
    localStorage.setItem("bda_token", data.token);
    setToken(data.token);
    setUser(parseJwt(data.token));
  };

  const logout = () => {
    localStorage.removeItem("bda_token");
    setToken(null);
    setUser(null);
  };

  const hasRole = (...roles: UserRole[]) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function authHeader(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
