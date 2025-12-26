import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.mecwide.com";
const AUTH_BASE_URL = process.env.EXPO_PUBLIC_AUTH_URL || "https://auth.mecwide.com";

// Instância principal para API geral
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instância para autenticação
export const authClient: AxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: adiciona token automaticamente
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("@mecconnect:token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor: tratamento de erros centralizado
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      switch (status) {
        case 400:
          throw new Error(data?.message || "Requisição inválida");
        case 401:
          // Token inválido ou expirado - limpar storage
          await AsyncStorage.multiRemove(["@mecconnect:token", "@mecconnect:user", "@mecconnect:accessApps"]);
          throw new Error("Sessão expirada. Faça login novamente.");
        case 403:
          throw new Error("Acesso negado");
        case 404:
          throw new Error(data?.message || "Recurso não encontrado");
        case 500:
          throw new Error("Erro no servidor. Tente novamente mais tarde.");
        default:
          throw new Error(data?.message || `Erro: ${status}`);
      }
    } else if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão.");
    } else {
      throw new Error(error.message || "Erro desconhecido");
    }
  }
);

// Auth client não precisa de token no header (é ele que obtém o token)
authClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      switch (status) {
        case 400:
          throw new Error(data?.message || "Credenciais inválidas");
        case 401:
          throw new Error("Utilizador ou senha incorretos");
        case 404:
          throw new Error("Endpoint de autenticação não encontrado");
        case 500:
          throw new Error("Erro no servidor de autenticação");
        default:
          throw new Error(data?.message || `Erro: ${status}`);
      }
    } else if (error.request) {
      throw new Error("Sem resposta do servidor. Verifique sua conexão.");
    } else {
      throw new Error(error.message || "Erro de autenticação");
    }
  }
);
