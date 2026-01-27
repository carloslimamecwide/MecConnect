import { AppText } from "@/src/components/Common/AppText";
import AppTitle from "@/src/components/Common/AppTitle";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { Input } from "@/src/components/Common/Input";
import { Select } from "@/src/components/Common/Select";
import { TextArea } from "@/src/components/Common/TextArea";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import { useAuth } from "../../../src/contexts/AuthContext";
import { useToast } from "../../../src/contexts/ToastContext";
import { notificationService } from "../../../src/services/notificationService";

interface ScreenOption {
  value: string;
  label: string;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notificationType, setNotificationType] = useState<"push" | "geral">("push");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [screen, setScreen] = useState("");
  const [url, setUrl] = useState("");
  const [screens, setScreens] = useState<ScreenOption[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Carregar screens
      const screenOptions = notificationService.getScreenOptions();
      setScreens(screenOptions);
    };

    loadData();
  }, []);

  const isFormValid =
    title.trim() !== "" &&
    message.trim() !== "" &&
    (notificationType === "push" || (notificationType === "geral" && url.trim() !== ""));

  const selectedScreenLabel = screens.find((opt) => opt.value === screen)?.label;

  const handleTestNotification = async () => {
    if (!isFormValid) {
      showToast({
        message: notificationType === "geral" ? "Preencha título, descrição e URL" : "Preencha o título e a mensagem",
        type: "error",
        position: "top",
      });
      return;
    }

    setIsTesting(true);
    try {
      await notificationService.testPushNotification(user?.cv || "", {
        title: title.trim(),
        message: message.trim(),
        screen: screen.trim() || undefined,
      });

      showToast({ message: "Notificação de teste enviada com sucesso!", type: "success", position: "top" });
      setTitle("");
      setMessage("");
 
      setScreen("");
      setUrl("");
    } catch (err: any) {
      showToast({ message: err.message || "Erro ao enviar notificação", type: "error", position: "top" });
    } finally {
      setIsTesting(false);
    }
  };

  const handleBroadcast = async () => {
    if (!isFormValid) {
      showToast({ message: "Preencha o título e a mensagem", type: "error", position: "top" });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmBroadcast = async () => {
    setIsSending(true);
    try {
      if (notificationType === "push") {
        await notificationService.broadcastPushNotification({
          title: title.trim(),
          message: message.trim(),
          screen: screen.trim() || "",
        });
      } else {
        // Serviço para notificação geral (exemplo)
        await notificationService.GeneralNotification(user?.cv || "", {
          title: title.trim(),
          description: message.trim(),
          url: url.trim(),
        });
      }
      showToast({ message: "Notificação enviada para todos com sucesso!", type: "success", position: "top" });
      setTitle("");
      setMessage("");
    
      setScreen("");
      setUrl("");
      setShowConfirmModal(false);
    } catch (err: any) {
      showToast({ message: err.message || "Erro ao enviar notificação", type: "error", position: "top" });
    } finally {
      setIsSending(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <AppLayout title="Notificações">
      <PageWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <AppTitle title="Central de Notificações" iconName="bell" />
            <View className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className={`h-2 w-2 rounded-full ${isFormValid ? "bg-emerald-400" : "bg-amber-400"}`} />
                <AppText className="text-xs text-gray-300">
                  {isFormValid
                    ? "Pronto para enviar"
                    : notificationType === "geral"
                      ? "Preencha título, descrição e URL"
                      : "Preencha título e mensagem"}
                </AppText>
              </View>
              <AppText className="text-xs text-gray-400">Destino opcional</AppText>
            </View>
          </View>
          {/* Tipo de notificação */}
          <View className="flex-row justify-around mb-6">
            <Button
              title="Push"
              width="48%"
              variant={notificationType === "push" ? "primary" : "secondary"}
              onPress={() => setNotificationType("push")}
              disabled={isSending || isTesting}
            />
            <Button
              title="Geral"
              width="48%"
              variant={notificationType === "geral" ? "primary" : "secondary"}
              onPress={() => setNotificationType("geral")}
              disabled={isSending || isTesting}
            />
          </View>

          <View className="gap-6 md:flex-row">
            {/* Formulário */}
            <View className="flex-1">
              <View className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <View className="border-l-4 border-blue-400/40 pl-4">
                  <AppText className="text-xs font-semibold text-blue-200 uppercase mb-4">Conteúdo</AppText>
                  <View className="gap-6">
                    <Input
                      label={notificationType === "geral" ? "Título" : "Título da Notificação"}
                      value={title}
                      onChangeText={setTitle}
                      placeholder={
                        notificationType === "geral"
                          ? "Ex: Novo documento disponível"
                          : "Ex: Nova atualização disponível"
                      }
                    />

                    <TextArea
                      label={notificationType === "geral" ? "Descrição" : "Mensagem"}
                      value={message}
                      onChangeText={setMessage}
                      placeholder={
                        notificationType === "geral"
                          ? "Descreva o conteúdo, link ou vídeo"
                          : "Ex: Uma nova versão está disponível para download"
                      }
                      rows={4}
                    />

                    {notificationType === "geral" && (
                      <Input
                        label="URL do Documento ou Vídeo"
                        value={url}
                        onChangeText={setUrl}
                        placeholder="Cole o link do documento, vídeo ou página"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    )}
                  </View>
                </View>

                {notificationType === "push" && (
                  <View className="border-t border-white/10 mt-6 pt-6">
                    <AppText className="text-xs font-semibold text-blue-200 uppercase mb-4">Destino (Opcional)</AppText>
                    <View className="gap-4">
                      <View>
                        <AppText className="text-sm font-semibold text-gray-300 mb-2">Screen para Redirecionar</AppText>
                        <Select
                          options={screens}
                          value={screen}
                          onChange={setScreen}
                          placeholder="Selecionar screen..."
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Pré-visualização + Ações */}
            <View className="md:w-80">
              <View className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <AppText className="text-xs font-semibold text-blue-200 uppercase mb-3">Pré-visualização</AppText>
                <View className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <View className="flex-row items-center gap-3 mb-3">
                    <View className="h-9 w-9 rounded-full bg-blue-500/20 items-center justify-center">
                      <FontAwesome5 name="bell" size={14} color="#60a5fa" />
                    </View>
                    <View className="flex-1">
                      <AppText className="text-xs text-gray-400">MecConnect</AppText>
                      <AppText className="text-xs text-gray-500">Agora</AppText>
                    </View>
                  </View>
                  <AppText className="text-sm font-semibold text-gray-100">
                    {title.trim() || (notificationType === "geral" ? "Título" : "Título da notificação")}
                  </AppText>
                  <AppText className="text-xs text-gray-300 mt-1">
                    {message.trim() ||
                      (notificationType === "geral"
                        ? "Descrição do conteúdo, link ou vídeo."
                        : "Escreva uma mensagem clara e objetiva para os utilizadores.")}
                  </AppText>
                  {notificationType === "geral" && url.trim() && (
                    <AppText className="text-xs text-blue-400 mt-2 break-all">{url}</AppText>
                  )}
                </View>

                {notificationType === "push" && (
                  <View className="border-t border-white/10 mt-4 pt-3">
                    <AppText className="text-xs text-gray-400">Screen: {selectedScreenLabel || "Nenhuma"}</AppText>
                  </View>
                )}
              </View>

              {/* Botões */}

              <View className="gap-3 mt-4 mb-8">
                {notificationType === "push" && (
                  <Button
                    title="Testar no Meu Dispositivo"
                    variant="info"
                    icon="mobile-alt"
                    isLoading={isTesting}
                    loadingText="Enviando..."
                    disabled={!isFormValid || isSending}
                    onPress={handleTestNotification}
                  />
                )}

                <Button
                  title="Confirmar e Enviar para Todos"
                  variant="success"
                  icon="paper-plane"
                  isLoading={isSending}
                  loadingText="Enviando..."
                  disabled={!isFormValid || isTesting}
                  onPress={handleBroadcast}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </PageWrapper>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={showConfirmModal}
        title="Confirmar envio"
        message="Deseja enviar esta notificação para todos os utilizadores?"
        confirmText="Enviar"
        cancelText="Cancelar"
        onConfirm={handleConfirmBroadcast}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isSending}
      />
    </AppLayout>
  );
}
