import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { AccessApp, User } from "../types/auth";

interface AuthContextData {
  user: User | null;
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
  const [accessApps, setAccessApps] = useState<AccessApp[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedUser = await authService.getUser();
      const storedAccessApps = await authService.getAccessApps();

      if (storedUser) {
        setUser(storedUser);
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
      setUser(response.user);
      setAccessApps(response.accessApps);
      setIsAdmin(await authService.isAdmin());
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    setAccessApps(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
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
