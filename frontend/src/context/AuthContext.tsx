import React, { createContext, useContext, useState, useMemo } from "react";
import { loginApi } from "../api/auth";
import type { LoginPayload, LoginResponse } from "../api/auth";


type AuthCtx = {
  token: string | null;
  role: string | null;
  email: string | null;
  login: (payload: LoginPayload, remember?: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("livemart:token") ||
      sessionStorage.getItem("livemart:token")
  );
  const [role, setRole] = useState<string | null>(
    localStorage.getItem("livemart:role") ||
      sessionStorage.getItem("livemart:role")
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("livemart:email") ||
      sessionStorage.getItem("livemart:email")
  );

  const login = async (payload: LoginPayload, remember = true) => {
    const data: LoginResponse = await loginApi(payload);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("livemart:token", data.access_token);
    storage.setItem("livemart:role", data.role);
    storage.setItem("livemart:email", data.email);
    setToken(data.access_token);
    setRole(data.role);
    setEmail(data.email);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  const value = useMemo(
    () => ({
      token,
      role,
      email,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token, role, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
