import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import type { AccessApp, BackendLoginResponse, LoginResponse, Role, User } from "../types/auth";

const AUTH_BASE_URL = Constants.expoConfig?.extra?.authBaseUrl;

const STORAGE_KEYS = {
  TOKEN: "@mecconnect:token",
  USER: "@mecconnect:user",
  ROLES: "@mecconnect:roles",
};

class AuthService {
  async login(cv: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_cv: cv, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao fazer login");
      }

      const backendData: BackendLoginResponse = await response.json();

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
      };

      const loginResponse: LoginResponse = {
        user,
        token: backendData.token,
        accessApps: backendData.accessApps,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginResponse.user));
      await AsyncStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(loginResponse.accessApps));

      return loginResponse;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER, STORAGE_KEYS.ROLES]);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
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
