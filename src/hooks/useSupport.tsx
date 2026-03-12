import * as FileSystemLegacy from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { supportService } from "../services/supportService";

function useSupport() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    cv: user?.cv || "",
    name: user?.nome || "",
    email: user?.prof_email || "",
    subject: "",
    description: "",
    platform: "MecConnect",
    device: Platform.OS,
    attachments: [] as { imageFile: string }[],
  });
  const [isSending, setIsSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePickFile = async () => {
    // Web não precisa de permissões
    if (Platform.OS !== "web") {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        showToast({ message: "Permissão para acessar a galeria é necessária.", type: "error", position: "top" });
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
      base64: Platform.OS === "web", // Web precisa de base64 direto
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      try {
        let base64: string;

        if (Platform.OS === "web") {
          // Web: usar base64 retornado pelo picker
          base64 = result.assets[0].base64 || "";
          if (!base64 && result.assets[0].uri) {
            // Fallback: converter blob URI para base64
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const result = reader.result as string;
                resolve(result.split(",")[1] || "");
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        } else {
          // iOS/Android: usar FileSystem
          base64 = await FileSystemLegacy.readAsStringAsync(result.assets[0].uri, { encoding: "base64" });
        }

        if (base64) {
          setForm((prev) => ({
            ...prev,
            attachments: [...prev.attachments, { imageFile: base64 }],
          }));
        } else {
          throw new Error("Não foi possível processar a imagem");
        }
      } catch (e) {
        console.error("Erro ao converter imagem:", e);
        showToast({ message: "Erro ao converter imagem.", type: "error", position: "top" });
      }
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.subject || !form.description) {
      showToast({ message: "Preencha todos os campos obrigatórios", type: "error", position: "top" });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    setIsSending(true);
    try {
      //   console.log("Enviando pedido de suporte:", JSON.stringify(form, null, 2));
      await supportService.sendSupport(form);
      showToast({ message: "Pedido enviado com sucesso!", type: "success", position: "top" });
      setShowConfirm(false);
      router.back();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao enviar pedido", type: "error", position: "top" });
    } finally {
      setIsSending(false);
    }
  };

  const attachmentsCount = form.attachments.length;
  return {
    form,
    isSending,
    showConfirm,
    attachmentsCount,
    handlePickFile,
    handleChange,
    handleSubmit,
    handleConfirmSend,
    setShowConfirm,
  };
}

export default useSupport;
