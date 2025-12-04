import { AppText } from "@/src/components/Common/AppText";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { Select } from "@/src/components/Common/Select";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";
import { useAuth } from "../../src/contexts/AuthContext";
import { authService } from "../../src/services/authService";
import { notificationService } from "../../src/services/notificationService";

interface SegmentOption {
  value: string;
  label: string;
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
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
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const getTokenAndData = async () => {
      const storedToken = await authService.getToken();
      setToken(storedToken);

      // Carregar screens
      const screenOptions = notificationService.getScreenOptions();
      setScreens(screenOptions);

      if (storedToken) {
        setIsLoadingSegments(true);
        try {
          const fetchedSegments = await notificationService.fetchSegments(storedToken);
          setSegments(fetchedSegments);
        } catch (err) {
          console.error("Erro ao carregar segmentos:", err);
        } finally {
          setIsLoadingSegments(false);
        }
      }
    };
    getTokenAndData();
  }, []);

  const isFormValid = title.trim() !== "" && message.trim() !== "";

  const showFeedback = (msg: string, type: "success" | "error") => {
    setFeedbackMessage(msg);
    setFeedbackType(type);
    setTimeout(() => setFeedbackType(null), 4000);
  };

  const handleTestNotification = async () => {
    if (!isFormValid) {
      showFeedback("Por favor, preencha o título e a mensagem", "error");
      return;
    }

    if (!token) {
      showFeedback("Token não encontrado. Faça login novamente.", "error");
      return;
    }

    setIsTesting(true);
    try {
      await notificationService.testNotification(user?.cv || "unknown", token, {
        title: title.trim(),
        message: message.trim(),
        screen: screen.trim() || undefined,
      });
      showFeedback("✓ Notificação de teste enviada com sucesso!", "success");
      setTitle("");
      setMessage("");
      setSegment("");
      setScreen("");
    } catch (err: any) {
      showFeedback(`Erro ao enviar: ${err.message || "Tente novamente"}`, "error");
    } finally {
      setIsTesting(false);
    }
  };

  const handleBroadcast = async () => {
    if (!isFormValid) {
      showFeedback("Por favor, preencha o título e a mensagem", "error");
      return;
    }

    if (!token) {
      showFeedback("Token não encontrado. Faça login novamente.", "error");
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
      showFeedback("✓ Notificação enviada para todos com sucesso!", "success");
      setTitle("");
      setMessage("");
      setSegment("");
      setScreen("");
      setShowConfirmModal(false);
    } catch (err: any) {
      showFeedback(`Erro ao enviar: ${err.message || "Tente novamente"}`, "error");
    } finally {
      setIsSending(false);
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

          {/* Feedback Messages */}
          {feedbackType && (
            <View
              className={`rounded-lg p-4 mb-6 flex-row items-center gap-3 border ${
                feedbackType === "success" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <FontAwesome5
                name={feedbackType === "success" ? "check-circle" : "exclamation-circle"}
                size={20}
                color={feedbackType === "success" ? "#10b981" : "#ef4444"}
              />
              <AppText className={`flex-1 text-sm ${feedbackType === "success" ? "text-green-400" : "text-red-400"}`}>
                {feedbackMessage}
              </AppText>
            </View>
          )}

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
                style={{ color: "#FFFFFF" }}
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
                style={{ color: "#FFFFFF", textAlignVertical: "top" }}
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
            <TouchableOpacity
              onPress={handleTestNotification}
              disabled={!isFormValid || isTesting || isSending}
              className={`rounded-lg py-3 items-center flex-row justify-center gap-2 ${
                !isFormValid || isTesting || isSending ? "opacity-50" : ""
              }`}
              style={{
                backgroundColor: isTesting ? "#6b7280" : "#3b82f6",
              }}
            >
              {isTesting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <FontAwesome5 name="mobile-alt" size={16} color="white" />
              )}
              <AppText className="text-white font-bold text-base">
                {isTesting ? "Enviando..." : "Testar no Meu Dispositivo"}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBroadcast}
              disabled={!isFormValid || isTesting || isSending}
              className={`rounded-lg py-3 items-center flex-row justify-center gap-2 ${
                !isFormValid || isTesting || isSending ? "opacity-50" : ""
              }`}
              style={{
                backgroundColor: isSending ? "#6b7280" : "#10b981",
              }}
            >
              {isSending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <FontAwesome5 name="paper-plane" size={16} color="white" />
              )}
              <AppText className="text-white font-bold text-base">
                {isSending ? "Enviando..." : "Confirmar e Enviar para Todos"}
              </AppText>
            </TouchableOpacity>
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
