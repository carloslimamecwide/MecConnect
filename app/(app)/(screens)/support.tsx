import { AppText } from "@/src/components/Common/AppText";
import { BackHeader } from "@/src/components/Common/BackHeader";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { Input } from "@/src/components/Common/Input";
import { TextArea } from "@/src/components/Common/TextArea";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import AttachmentsSection from "../../../src/components/settings/AttachmentsSection";
import useSupport from "../../../src/hooks/useSupport";
export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const {
    form,
    isSending,
    showConfirm,
    attachmentsCount,
    handlePickFile,
    handleChange,
    handleSubmit,
    handleConfirmSend,
    setShowConfirm,
  } = useSupport();

  return (
    <>
      <AppLayout title="Suporte Técnico">
        <PageWrapper>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : undefined} style={{ flex: 1 }}>
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

                  {/* Secção: Informações do Suporte */}
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

                  {/* Secção: Formulário de Relato */}
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
                      <AttachmentsSection attachmentsCount={attachmentsCount} form={form} />
                    </View>
                  </View>
                </View>
                <Button title="Enviar Pedido" onPress={handleSubmit} isLoading={isSending} className="mt-4" />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </PageWrapper>
      </AppLayout>

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
    </>
  );
}
