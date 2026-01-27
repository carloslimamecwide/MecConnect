import { AppText } from "@/src/components/Common/AppText";
import AppTitle from "@/src/components/Common/AppTitle";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { DateTimePicker } from "@/src/components/Common/DateTimePicker";
import { Input } from "@/src/components/Common/Input";
import { Select } from "@/src/components/Common/Select";
import { TextArea } from "@/src/components/Common/TextArea";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet from "@gorhom/bottom-sheet";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import { useAuth } from "../../../src/contexts/AuthContext";
import { useToast } from "../../../src/contexts/ToastContext";
import { notificationService, type NotificationAttachment } from "../../../src/services/notificationService";

interface ScreenOption {
  value: string;
  label: string;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const dateTimePickerRef = useRef<BottomSheet>(null);
  const [notificationType, setNotificationType] = useState<"push" | "geral">("push");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [screen, setScreen] = useState("");
  const [url, setUrl] = useState("");
  const [attachment, setAttachment] = useState<NotificationAttachment | null>(null);
  const [publishAt, setPublishAt] = useState<Date | null>(null);
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
    (notificationType === "push" || (notificationType === "geral" && (url.trim() !== "" || Boolean(attachment))));

  const formatDateTimeLabel = (date: Date) =>
    date.toLocaleString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatFileSize = (size?: number) => {
    if (!size) return "";
    const units = ["B", "KB", "MB", "GB"];
    let value = size;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    const precision = value >= 10 || unitIndex === 0 ? 0 : 1;
    return `${value.toFixed(precision)} ${units[unitIndex]}`;
  };

  const handlePickAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "video/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      let webBlob: Blob | undefined;

      if (Platform.OS === "web") {
        const response = await fetch(asset.uri);
        webBlob = await response.blob();
      }

      setAttachment({
        name: asset.name,
        size: asset.size,
        mimeType: asset.mimeType,
        uri: asset.uri,
        webBlob,
      });
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao anexar ficheiro", type: "error", position: "top" });
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const selectedScreenLabel = screens.find((opt) => opt.value === screen)?.label;

  const handleTestNotification = async () => {
    if (!isFormValid) {
      showToast({
        message:
          notificationType === "geral"
            ? "Preencha título, descrição e adicione um link ou anexo"
            : "Preencha o título e a mensagem",
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
        publishAt: publishAt ? publishAt.toISOString() : undefined,
      });

      showToast({ message: "Notificação de teste enviada com sucesso!", type: "success", position: "top" });
      setTitle("");
      setMessage("");
      setScreen("");
      setUrl("");
      setAttachment(null);
      setPublishAt(null);
    } catch (err: any) {
      showToast({ message: err.message || "Erro ao enviar notificação", type: "error", position: "top" });
    } finally {
      setIsTesting(false);
    }
  };

  const handleBroadcast = async () => {
    if (!isFormValid) {
      showToast({
        message:
          notificationType === "geral"
            ? "Preencha título, descrição e adicione um link ou anexo"
            : "Preencha o título e a mensagem",
        type: "error",
        position: "top",
      });
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
          publishAt: publishAt ? publishAt.toISOString() : undefined,
        });
      } else {
        await notificationService.GeneralNotification(
          user?.cv || "",
          {
            title: title.trim(),
            description: message.trim(),
            url: url.trim() || "",
            publishAt: publishAt ? publishAt.toISOString() : undefined,
          },
          attachment || undefined,
        );
      }
      showToast({ message: "Notificação enviada para todos com sucesso!", type: "success", position: "top" });
      setTitle("");
      setMessage("");
      setScreen("");
      setUrl("");
      setAttachment(null);
      setPublishAt(null);
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
                      ? "Preencha título, descrição e link ou anexo"
                      : "Preencha título e mensagem"}
                </AppText>
              </View>
              <AppText className="text-xs text-gray-400">
                {notificationType === "push" ? "Destino opcional" : "Disponível noutra app"}
              </AppText>
            </View>
          </View>
          {/* Tipo de notificação */}
          <View className="flex-row justify-around mb-6">
            <Button
              title="Push Notification"
              width="48%"
              variant={notificationType === "push" ? "primary" : "secondary"}
              onPress={() => setNotificationType("push")}
              disabled={isSending || isTesting}
            />
            <Button
              title="Geral (PDF/Vídeo)"
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
                          ? "Ex: Novo documento disponível no Dossiê"
                          : "Ex: Nova atualização disponível"
                      }
                    />

                    <TextArea
                      label={notificationType === "geral" ? "Descrição" : "Mensagem"}
                      value={message}
                      onChangeText={setMessage}
                      placeholder={
                        notificationType === "geral"
                          ? "Descreva o conteúdo e indique o contexto do PDF ou vídeo"
                          : "Ex: Uma nova versão está disponível para download"
                      }
                      rows={4}
                    />

                    {notificationType === "geral" && (
                      <>
                        <Input
                          label="Link de apoio (opcional)"
                          value={url}
                          onChangeText={setUrl}
                          placeholder="Cole um link complementar (documento, vídeo ou página)"
                          autoCapitalize="none"
                          autoCorrect={false}
                        />

                        <View className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <AppText className="text-xs font-semibold text-gray-300 uppercase mb-3">Anexos</AppText>
                          {attachment ? (
                            <View className="flex-row items-center justify-between gap-3">
                              <View className="flex-row items-center gap-3 flex-1">
                                <View className="h-9 w-9 rounded-lg bg-blue-500/20 items-center justify-center">
                                  <FontAwesome5
                                    name={attachment.mimeType?.startsWith("video") ? "video" : "file-pdf"}
                                    size={14}
                                    color="#93c5fd"
                                  />
                                </View>
                                <View className="flex-1">
                                  <AppText className="text-sm text-gray-100" numberOfLines={1}>
                                    {attachment.name}
                                  </AppText>
                                  <AppText className="text-[11px] text-gray-500">
                                    {attachment.mimeType || "Ficheiro"}
                                    {attachment.size ? ` · ${formatFileSize(attachment.size)}` : ""}
                                  </AppText>
                                </View>
                              </View>
                              <Button
                                title="Remover"
                                variant="secondary"
                                width="auto"
                                className="px-3 py-1.5"
                                onPress={handleRemoveAttachment}
                              />
                            </View>
                          ) : (
                            <Button
                              title="Anexar PDF ou Vídeo"
                              variant="secondary"
                              icon="paperclip"
                              onPress={handlePickAttachment}
                            />
                          )}
                          <AppText className="text-[11px] text-gray-500 mt-2">
                            PDF ou vídeo ficam disponíveis noutra app após o envio.
                          </AppText>
                        </View>

                        <View className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <AppText className="text-xs font-semibold text-gray-300 uppercase mb-3">Divulgação</AppText>
                          <View className="flex-row items-center justify-between gap-3">
                            <View className="flex-1">
                              <AppText className="text-xs text-gray-400">Data e hora</AppText>
                              <AppText className="text-sm font-semibold text-gray-100">
                                {publishAt ? formatDateTimeLabel(publishAt) : "Envio imediato"}
                              </AppText>
                            </View>
                            <Button
                              title={publishAt ? "Alterar" : "Agendar"}
                              variant="info"
                              width="auto"
                              className="px-3 py-1.5"
                              onPress={() => dateTimePickerRef.current?.expand()}
                            />
                          </View>
                          {publishAt && (
                            <Button
                              title="Remover agendamento"
                              variant="secondary"
                              width="auto"
                              className="mt-3 px-3 py-1.5 self-start"
                              onPress={() => setPublishAt(null)}
                            />
                          )}
                        </View>
                      </>
                    )}
                  </View>
                </View>

                {notificationType === "push" && (
                  <>
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

                    <View className="rounded-xl border border-white/10 bg-white/5 p-4 mt-6">
                      <AppText className="text-xs font-semibold text-gray-300 uppercase mb-3">Divulgação</AppText>
                      <View className="flex-row items-center justify-between gap-3">
                        <View className="flex-1">
                          <AppText className="text-xs text-gray-400">Data e hora</AppText>
                          <AppText className="text-sm font-semibold text-gray-100">
                            {publishAt ? formatDateTimeLabel(publishAt) : "Envio imediato"}
                          </AppText>
                        </View>
                        <Button
                          title={publishAt ? "Alterar" : "Agendar"}
                          variant="info"
                          width="auto"
                          className="px-3 py-1.5"
                          onPress={() => dateTimePickerRef.current?.expand()}
                        />
                      </View>
                      {publishAt && (
                        <Button
                          title="Remover agendamento"
                          variant="secondary"
                          width="auto"
                          className="mt-3 px-3 py-1.5 self-start"
                          onPress={() => setPublishAt(null)}
                        />
                      )}
                    </View>
                  </>
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
                      <AppText className="text-xs text-gray-500">{publishAt ? "Agendado" : "Agora"}</AppText>
                    </View>
                  </View>
                  <AppText className="text-sm font-semibold text-gray-100">
                    {title.trim() || (notificationType === "geral" ? "Título" : "Título da notificação")}
                  </AppText>
                  <AppText className="text-xs text-gray-300 mt-1">
                    {message.trim() ||
                      (notificationType === "geral"
                        ? "Descrição do conteúdo anexado ou linkado."
                        : "Escreva uma mensagem clara e objetiva para os utilizadores.")}
                  </AppText>
                  {notificationType === "geral" && (
                    <>
                      {url.trim() && <AppText className="text-xs text-blue-400 mt-2 break-all">{url}</AppText>}
                      {attachment && (
                        <View className="flex-row items-center gap-2 mt-2">
                          <FontAwesome5 name="paperclip" size={12} color="#9ca3af" />
                          <AppText className="text-xs text-gray-300" numberOfLines={1}>
                            {attachment.name}
                          </AppText>
                        </View>
                      )}
                      {publishAt && (
                        <AppText className="text-[11px] text-amber-300 mt-2">
                          Divulgação: {formatDateTimeLabel(publishAt)}
                        </AppText>
                      )}
                    </>
                  )}
                </View>

                {notificationType === "push" && (
                  <View className="border-t border-white/10 mt-4 pt-3">
                    <AppText className="text-xs text-gray-400">Screen: {selectedScreenLabel || "Nenhuma"}</AppText>
                    {publishAt && (
                      <AppText className="text-[11px] text-amber-300 mt-2">
                        Divulgação: {formatDateTimeLabel(publishAt)}
                      </AppText>
                    )}
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

      <DateTimePicker ref={dateTimePickerRef} value={publishAt ?? new Date()} onChange={(date) => setPublishAt(date)} />

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
