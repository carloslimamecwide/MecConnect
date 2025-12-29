import { apiClient } from "../services/apiClient";

export const supportService = {
  sendSupport: async (payload: {
    cv: string;
    name: string;
    email: string;
    platform: string;
    device: string;
    subject: string;
    description: string;
    attachments: { imageFile: string }[];
  }) => {
    // Se precisar enviar arquivos reais, use FormData. Aqui, envia como JSON.
    const res = await apiClient.post("/Support", payload);
    return res.data;
  },
};
