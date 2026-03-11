"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "@/lib/api";

type AuthContextType = { user: User | null; token: string | null; login: (token: string, user: User) => void; logout: () => void; isReady: boolean };
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) { setToken(t); try { setUser(JSON.parse(u)); } catch { localStorage.removeItem("token"); localStorage.removeItem("user"); } }
    setIsReady(true);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken); setUser(newUser);
    localStorage.setItem("token", newToken); localStorage.setItem("user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null); setUser(null);
    localStorage.removeItem("token"); localStorage.removeItem("user");
  }, []);

  return <AuthContext.Provider value={{ user, token, login, logout, isReady }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
