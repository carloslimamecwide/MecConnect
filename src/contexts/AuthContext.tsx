import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { AccessApp, User } from "../types/auth";

interface AuthContextData {
  user: User | null;
  token: string | null;
  accessApps: AccessApp[] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [accessApps, setAccessApps] = useState<AccessApp[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedUser = await authService.getUser();
      const storedToken = await authService.getToken();
      const storedAccessApps = await authService.getAccessApps();

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
        setAccessApps(storedAccessApps);
        setIsAdmin(await authService.isAdmin());
      }
    } catch (error) {
      console.error("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, password: string) {
    try {
      const response = await authService.login(username, password);

      // Verificar se é ADM e tem default: true
      const isAdminUser = await authService.isAdmin();
      const hasDefaultRole = response.accessApps.some((app) =>
        app.roles.some((role) => role.role === "ADM" && role.default === true)
      );

      if (!isAdminUser || !hasDefaultRole) {
        await authService.logout();
        throw new Error("Acesso negado. Apenas administradores com perfil padrão podem aceder.");
      }

      setUser(response.user);
      setToken(response.token);
      setAccessApps(response.accessApps);
      setIsAdmin(isAdminUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    setToken(null);
    setAccessApps(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        accessApps,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
