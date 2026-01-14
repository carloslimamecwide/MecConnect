import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import * as biometricService from "../services/biometricService";
import { User } from "../types/auth";
interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await authService.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      // Decodifica o token para obter o cv do usuário
      const decoded = await authService.decodeToken(storedToken);
      const cv = decoded?.nameid || "";
      if (!cv) {
        setIsLoading(false);
        return;
      }
      const matrixUser = await authService.getMatrizHierarquica(cv);
      // Se biometria estiver habilitada, exige autenticação biométrica
      if (await biometricService.isBiometricEnabled()) {
        const ok = await biometricService.authenticateBiometric();
        if (!ok) {
          // Se biometria falhar, faz logout e limpa token
          await authService.logout();
          setUser(null);
          setToken(null);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
      }
      setUser(matrixUser);
      setToken(storedToken);
      setIsAdmin(await authService.isAdmin(storedToken));
      setIsSuperAdmin(await authService.isSuperAdmin(storedToken));
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
      setToken(response.token);
      setIsAdmin(response.isAdminUser);
      setIsSuperAdmin(response.isSuperAdminUser);
      // Após login bem-sucedido, ativa biometria se disponível
      if (await biometricService.isBiometricAvailable()) {
        await biometricService.enableBiometric();
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        isSuperAdmin,
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
