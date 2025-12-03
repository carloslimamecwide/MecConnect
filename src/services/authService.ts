import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LoginCredentials, LoginResponse, Role, User } from "../types/auth";

const API_BASE_URL = "https://api.example.com"; // Replace with actual base URL or import from env

const STORAGE_KEYS = {
  TOKEN: "@mecconnect:token",
  USER: "@mecconnect:user",
  ROLES: "@mecconnect:roles",
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao fazer login");
      }

      const data: LoginResponse = await response.json();

      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      await AsyncStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(data.roles));

      return data;
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

  async getRoles(): Promise<Role[] | null> {
    const rolesJson = await AsyncStorage.getItem(STORAGE_KEYS.ROLES);
    return rolesJson ? JSON.parse(rolesJson) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
