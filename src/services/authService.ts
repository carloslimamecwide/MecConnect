import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { AccessApp, BackendLoginResponse, LoginResponse, Role, User } from "../types/auth";
import { authClient } from "./apiClient";

const STORAGE_KEYS = {
  TOKEN: "mecconnect_token",
  USER: "mecconnect_user",
  ROLES: "mecconnect_roles",
};

class AuthService {
  async login(cv: string, password: string): Promise<LoginResponse> {
    try {
      const response = await authClient.post<BackendLoginResponse>("/Auth/login", {
        user_cv: cv,
        password,
      });

      const backendData = response.data;

      if (!backendData.token) {
        throw new Error("Token não recebido do servidor");
      }

      // Mapear resposta do backend para o formato interno
      const user: User = {
        cv: backendData.cv,
        nome: backendData.nome,
        prof_email: backendData.prof_email,
        bi: backendData.bi,
        country: backendData.country,
        address: backendData.address,
        location: backendData.location,
        city: backendData.city,
        nationality: backendData.nationality,
        district: backendData.district,
        job: backendData.job,
        desc_job: backendData.desc_job,
        photo: backendData.photo,
        roleIt: "developer", // Valor fixo conforme solicitado
      };
      console.log("User logged in:", JSON.stringify(user, null, 2));

      const loginResponse: LoginResponse = {
        user,
        token: backendData.token,
        accessApps: backendData.accessApps,
      };

      if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.token);
      } else {
        await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, loginResponse.token, {
          keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY,
        });
      }
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginResponse.user));
      await AsyncStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(loginResponse.accessApps));

      return loginResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } else {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
    }
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.ROLES]);
  }

  async getToken(): Promise<string | null> {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(STORAGE_KEYS.TOKEN);
    } else {
      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    }
  }

  async getUser(): Promise<User | null> {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  async getAccessApps(): Promise<AccessApp[] | null> {
    const appsJson = await AsyncStorage.getItem(STORAGE_KEYS.ROLES);
    return appsJson ? JSON.parse(appsJson) : null;
  }

  async isAdmin(): Promise<boolean> {
    const apps = await this.getAccessApps();
    if (!apps) return false;

    const ferApp = apps.find((app) => app.app === "FER");
    if (!ferApp) return false;

    return ferApp.roles.some((role: Role) => role.role === "ADM");
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
