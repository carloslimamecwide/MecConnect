import { AppText } from "@/src/components/Common/AppText";
import { BackHeader } from "@/src/components/Common/BackHeader";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { Input } from "@/src/components/Common/Input";
import { TextArea } from "@/src/components/Common/TextArea";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as FileSystemLegacy from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import { supportService } from "../../../src/services/supportService";

export default function SupportScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      allowsEditing: false,
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

  const attachmentsCount = form.attachments.length;

  return (
    <AppLayout title="Suporte Técnico">
      <PageWrapper>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              paddingBottom: 24 + insets.bottom,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, justifyContent: "space-between", minHeight: 400 }}>
              <View style={{ flexGrow: 1 }}>
                <BackHeader>
                  <AppText className="text-xl font-bold text-gray-100">Suporte Técnico</AppText>
                </BackHeader>

                <View className="mb-6 rounded-xl bg-white/5 border border-white/10 p-4 flex-row items-center gap-3">
                  <View className="h-11 w-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 items-center justify-center">
                    <FontAwesome5 name="headset" size={16} color="#60a5fa" />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-sm text-gray-200">
                      Conte-nos o que aconteceu e anexos ajudam a resolver mais rápido.
                    </AppText>
                    <AppText className="text-xs text-gray-400 mt-1">
                      Responderemos para {form.email || "o seu email"}.
                    </AppText>
                  </View>
                </View>

                <View className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <View className="border-l-4 border-blue-400/40 pl-4">
                    <AppText className="text-xs font-semibold text-blue-200 uppercase mb-4">Detalhes</AppText>
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
                      rows={6}
                      minHeight={160}
                    />
                  </View>

                  <View className="border-t border-white/10 mt-6 pt-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <AppText className="text-xs font-semibold text-blue-200 uppercase">Anexos (opcional)</AppText>
                      <AppText className="text-xs text-gray-400">{attachmentsCount} item(s)</AppText>
                    </View>
                    <AppText className="text-xs text-gray-400 mb-3">
                      Adicione imagens para ajudar a equipe a entender o problema.
                    </AppText>
                    <Button
                      title="Anexar Imagem"
                      icon="camera"
                      onPress={handlePickFile}
                      variant="secondary"
                      width="auto"
                      className="self-start"
                    />
                    {attachmentsCount > 0 ? (
                      <View className="flex-row flex-wrap gap-2 mt-3">
                        {form.attachments.map((a, i) => (
                          <View key={i} className="rounded-lg border border-white/10 overflow-hidden">
                            <Image
                              source={{
                                uri: a.imageFile.startsWith("data:")
                                  ? a.imageFile
                                  : `data:image/jpeg;base64,${a.imageFile}`,
                              }}
                              style={{ width: 72, height: 72, backgroundColor: "#111" }}
                            />
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View className="mt-3 rounded-lg border border-dashed border-white/10 p-4">
                        <AppText className="text-xs text-gray-500">Nenhum anexo adicionado.</AppText>
                      </View>
                    )}
                  </View>
                </View>
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
