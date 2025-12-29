import { AppText } from "@/src/components/Common/AppText";
import { BackHeader } from "@/src/components/Common/BackHeader";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { Input } from "@/src/components/Common/Input";
import { TextArea } from "@/src/components/Common/TextArea";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import * as FileSystemLegacy from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import { supportService } from "../../../src/services/supportService";

export default function SupportScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showToast({ message: "Permissão para acessar a galeria é necessária.", type: "error", position: "top" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      try {
        const base64 = await FileSystemLegacy.readAsStringAsync(result.assets[0].uri, { encoding: "base64" });
        setForm((prev) => ({
          ...prev,
          attachments: [...prev.attachments, { imageFile: base64 }],
        }));
      } catch (e) {
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
      // console.log("Enviando pedido de suporte:", JSON.stringify(form, null, 2));
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

  return (
    <AppLayout title="Suporte Técnico">
      <PageWrapper>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, justifyContent: "space-between", minHeight: 400 }}>
              <View style={{ flexGrow: 1 }}>
                <BackHeader>
                  <AppText className="text-xl font-bold text-gray-100">Suporte Técnico</AppText>
                </BackHeader>
                <Input
                  label="Assunto"
                  value={form.subject}
                  onChangeText={(v) => handleChange("subject", v)}
                  placeholder="Assunto"
                />
                <TextArea
                  label="Descrição"
                  value={form.description}
                  onChangeText={(v) => handleChange("description", v)}
                  placeholder="Descreva o problema"
                  className="mt-4"
                  rows={50}
                  minHeight={200}
                />
                <Button
                  title="Anexar Imagem"
                  icon="camera"
                  onPress={handlePickFile}
                  variant="secondary"
                  className="mt-4"
                  fullWidth={false}
                />
                {form.attachments.length > 0 && (
                  <View className="flex-row flex-wrap gap-2 mt-2 mb-2">
                    {form.attachments.map((a, i) => (
                      <View
                        key={i}
                        style={{ borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#222" }}
                      >
                        <Image
                          source={{ uri: a.imageFile }}
                          style={{ width: 64, height: 64, backgroundColor: "#222" }}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <Button title="Enviar Pedido" onPress={handleSubmit} isLoading={isSending} className="mt-4" />
              <ConfirmModal
                visible={showConfirm}
                title="Confirmar envio"
                message="Tem certeza que deseja enviar este pedido de suporte?"
                confirmText="Enviar"
                cancelText="Cancelar"
                onConfirm={handleConfirmSend}
                onCancel={() => setShowConfirm(false)}
                isLoading={isSending}
                isDangerous={false}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </PageWrapper>
    </AppLayout>
  );
}
