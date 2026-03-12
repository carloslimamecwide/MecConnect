import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";
import { STORAGE_KEYS } from "../constants/storage";
import type { LoginResponse, User } from "../types/auth";
import type { MyTokenPayload } from "../types/token";
import { authClient } from "./apiClient";

class AuthService {
  async login(cv: string, password: string): Promise<LoginResponse> {
    try {
      const response = await authClient.post<LoginResponse>("/Auth/App/FER/login", {
        user_cv: cv,
        password,
      });

      const isAdminUser = await this.isAdmin(response.data.token);
      if (!isAdminUser) {
        throw new Error("Usuário não possui privilégios de administrador");
      }
      const isSuperAdmin = await this.isSuperAdmin(response.data.token);
      const user = await this.getCurrentUser(response.data.token);

      console.log("Logged in user:", JSON.stringify(user, null, 2));
      const loginResponse: LoginResponse = {
        user,
        token: response.data.token,
        isAdminUser,
        isSuperAdminUser: isSuperAdmin,
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

  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await authClient.get<User>("/Auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
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
      return decoded.role[0] === "COL" || decoded.role[0] === "ADM";
    } else {
      return decoded.role === "COL" || decoded.role === "ADM";
    }
  }
  async isSuperAdmin(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }
    const decoded = await this.decodeToken(token);
    if (!decoded.role) {
      return false;
    }
    if (Array.isArray(decoded.role)) {
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
