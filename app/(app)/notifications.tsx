import { AppText } from "@/src/components/Common/AppText";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { Select } from "@/src/components/Common/Select";
import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";
import { useAuth } from "../../src/contexts/AuthContext";
import { useToast } from "../../src/contexts/ToastContext";
import { notificationService } from "../../src/services/notificationService";

interface SegmentOption {
  value: string;
  label: string;
}

export default function NotificationsScreen() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [segment, setSegment] = useState("");
  const [screen, setScreen] = useState("");
  const [segments, setSegments] = useState<SegmentOption[]>([]);
  const [screens, setScreens] = useState<SegmentOption[]>([]);
  const [isLoadingSegments, setIsLoadingSegments] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Carregar screens
      const screenOptions = notificationService.getScreenOptions();
      setScreens(screenOptions);

      if (token) {
        setIsLoadingSegments(true);
        try {
          const fetchedSegments = await notificationService.fetchSegments(token);
          setSegments(fetchedSegments);
        } catch (err) {
          console.error("Erro ao carregar segmentos:", err);
          showToast({ message: "Erro ao carregar segmentos", type: "error", position: "top" });
        } finally {
          setIsLoadingSegments(false);
        }
      }
    };
    loadData();
  }, [token]);

  const isFormValid = title.trim() !== "" && message.trim() !== "";

  const handleTestNotification = async () => {
    if (!isFormValid) {
      showToast({ message: "Preencha o título e a mensagem", type: "error", position: "top" });
      return;
    }

    if (!token) {
      showToast({ message: "Token não encontrado. Faça login novamente.", type: "error", position: "top" });
      return;
    }

    setIsTesting(true);
    try {
      await notificationService.testNotification(user?.cv || "unknown", token, {
        title: title.trim(),
        message: message.trim(),
        screen: screen.trim() || undefined,
      });
      showToast({ message: "Notificação de teste enviada com sucesso!", type: "success", position: "top" });
      setTitle("");
      setMessage("");
      setSegment("");
      setScreen("");
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

    if (!token) {
      showToast({ message: "Token não encontrado. Faça login novamente.", type: "error", position: "top" });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmBroadcast = async () => {
    setIsSending(true);
    try {
      await notificationService.broadcastNotification(token!, {
        title: title.trim(),
        message: message.trim(),
        segment: segment.trim() || undefined,
        screen: screen.trim() || undefined,
      });
      showToast({ message: "Notificação enviada para todos com sucesso!", type: "success", position: "top" });
      setTitle("");
      setMessage("");
      setSegment("");
      setScreen("");
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
            <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Central de Notificações</AppText>
            <AppText className="text-gray-300 text-sm md:text-base">Envie e teste notificações push</AppText>
          </View>

          {/* Formulário */}
          <View className="gap-6 mb-8">
            {/* Input: Título */}
            <View>
              <AppText className="text-sm font-semibold text-gray-300 mb-2">Título da Notificação</AppText>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Nova atualização disponível"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="border-b border-slate-400 px-0 py-3 text-base"
                style={{ color: "#FFFFFF", outline: "none" } as any}
              />
            </View>

            {/* Input: Mensagem */}
            <View>
              <AppText className="text-sm font-semibold text-gray-300 mb-2">Mensagem</AppText>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Ex: Uma nova versão está disponível para download"
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                numberOfLines={4}
                className="border border-slate-400 rounded-lg px-3 py-3 text-base"
                style={{ color: "#FFFFFF", textAlignVertical: "top", outline: "none" } as any}
              />
            </View>

            {/* Input: Segmento (Opcional) */}
            <View>
              <AppText className="text-sm font-semibold text-gray-300 mb-2">Segmento (Opcional)</AppText>
              <Select
                options={segments}
                value={segment}
                onChange={setSegment}
                placeholder="Selecionar segmento..."
                isLoading={isLoadingSegments}
              />
            </View>

            {/* Input: Screen/Rota (Opcional) */}
            <View>
              <AppText className="text-sm font-semibold text-gray-300 mb-2">
                Screen para Redirecionar (Opcional)
              </AppText>
              <Select options={screens} value={screen} onChange={setScreen} placeholder="Selecionar screen..." />
            </View>
          </View>

          {/* Pré-visualização */}
          {(title || message) && (
            <View className="mb-8 p-5 rounded-lg bg-white/5 border border-white/10">
              <AppText className="text-xs font-semibold text-gray-400 mb-3 uppercase">Pré-visualização</AppText>
              <View className="gap-2">
                {title && <AppText className="font-bold text-gray-100">{title}</AppText>}
                {message && <AppText className="text-gray-300 text-sm leading-5">{message}</AppText>}
              </View>
            </View>
          )}

          {/* Botões */}
          <View className="gap-3 mb-8">
            <Button
              title="Testar no Meu Dispositivo"
              variant="info"
              icon="mobile-alt"
              isLoading={isTesting}
              loadingText="Enviando..."
              disabled={!isFormValid || isSending}
              onPress={handleTestNotification}
            />

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
