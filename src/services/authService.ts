import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";
import type { BackendLoginResponse, LoginResponse, User } from "../types/auth";
import { apiClient, authClient } from "./apiClient";

const STORAGE_KEYS = {
  TOKEN: "mecconnect_token",
};

export type MyTokenPayload = {
  jti: string;
  nameid: string;
  email: string;
  given_name: string;
  app_id: string;
  role: string | string[];
  nbf: number;
  exp: number;
  iat: number;
};

class AuthService {
  async login(cv: string, password: string): Promise<LoginResponse> {
    try {
      const response = await authClient.post<BackendLoginResponse>("/Auth/App/FER/login", {
        user_cv: cv,
        password,
      });

      const isAdminUser = await this.isAdmin(response.data.token);
      if (!isAdminUser) {
        throw new Error("Usuário não possui privilégios de administrador");
      }
      const matrix = await this.getMatrizHierarquica(response.data.cv);
      // Mapear resposta do backend para o formato interno
      const user: User = {
        cv: matrix.cv,
        nome: matrix.nome,
        email_prof: matrix.email_prof,
        ax2: matrix.ax2,
        desc_ax2: matrix.desc_ax2,
        rc: matrix.rc,
        roleIt: "developer",
      };
      const loginResponse: LoginResponse = {
        user,
        token: response.data.token,
        isAdminUser: isAdminUser,
      };

      if (Platform.OS === "web") {
        localStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.token);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, loginResponse.token, {
          keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
        });
      }
      return loginResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  async getMatrizHierarquica(cv: string): Promise<User> {
    try {
      const response = await apiClient.get(`/HierarchyMatrix/${cv}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching matriz hierarquica:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (Platform.OS === "web") {
      window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
    }
  }

  async getToken(): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } else {
      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    }
  }

  async isAdmin(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    const decoded = await this.decodeToken(token);
    if (!decoded.role) {
      return false;
    }
    if (Array.isArray(decoded.role)) {
      // Verifica apenas o primeiro índice do array de roles
      return decoded.role[0] === "ADM";
    } else {
      return decoded.role === "ADM";
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async decodeToken(token: string): Promise<MyTokenPayload> {
    try {
      return jwtDecode<MyTokenPayload>(token);
    } catch {
      return {} as MyTokenPayload;
    }
  }
}

export const authService = new AuthService();
