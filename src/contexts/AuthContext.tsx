import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { Role, User } from "../types/auth";

interface AuthContextData {
  user: User | null;
  roles: Role[] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedUser = await authService.getUser();
      const storedRoles = await authService.getRoles();

      if (storedUser) {
        setUser(storedUser);
        setRoles(storedRoles);
      }
    } catch (error) {
      console.error("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string, password: string) {
    try {
      const response = await authService.login({ username, password });
      setUser(response.user);
      setRoles(response.roles);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    setRoles(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        isAuthenticated: !!user,
        isLoading,
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
