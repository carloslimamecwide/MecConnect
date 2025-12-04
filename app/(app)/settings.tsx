import { AppText } from "@/src/components/Common/AppText";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";
import { useAuth } from "../../src/contexts/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const appVersion = Constants.expoConfig?.version || "1.0.0";

  const appName = Constants.expoConfig?.name || "MecConnect";
  const supportEmail = "support@mecwide.com";

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleSendEmail = async () => {
    const subject = encodeURIComponent("Pedido de Suporte - MecConnect");
    const body = encodeURIComponent("Olá,\n\nTenho uma dúvida/problema com a aplicação MecConnect:\n\n");
    const url = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening email:", error);
    }
  };

  return (
    <>
      <AppLayout title="Definições">
        <PageWrapper>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-8">
              <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Definições da Aplicação</AppText>
              <AppText className="text-gray-300 text-sm md:text-base">Configure preferências e parâmetros</AppText>
            </View>

            {/* Secção: Conta / Perfil */}
            <View className="mb-8">
              <AppText className="text-lg font-bold text-gray-100 mb-4">Conta</AppText>

              {/* Perfil do Utilizador */}
              <View className="rounded-xl p-5 bg-white/10 border border-white/10 mb-3 flex-row items-center justify-between">
                <View className="flex-1">
                  <AppText className="text-sm font-semibold text-gray-400 mb-1">Utilizador</AppText>
                  <AppText className="text-base font-semibold text-gray-100">
                    {user?.nome || "Utilizador Desconhecido"}
                  </AppText>
                  {user?.prof_email && <AppText className="text-xs text-gray-500 mt-1">{user.prof_email}</AppText>}
                </View>
              </View>

              {/* Informação do Utilizador */}
              {user?.desc_job && (
                <View className="rounded-xl p-5 bg-white/10 border border-white/10 mb-3">
                  <AppText className="text-sm font-semibold text-gray-400 mb-1">Cargo</AppText>
                  <AppText className="text-base text-gray-100">{user.desc_job}</AppText>
                </View>
              )}

              {user?.city && (
                <View className="rounded-xl p-5 bg-white/10 border border-white/10">
                  <AppText className="text-sm font-semibold text-gray-400 mb-1">Localização</AppText>
                  <AppText className="text-base text-gray-100">{user.city}</AppText>
                </View>
              )}
            </View>

            {/* Secção: Aplicação / Sobre */}
            <View className="mb-8">
              <AppText className="text-lg font-bold text-gray-100 mb-4">Aplicação</AppText>

              {/* Nome da App */}
              <View className="rounded-xl p-5 bg-white/10 border border-white/10 mb-3 flex-row items-center justify-between">
                <View>
                  <AppText className="text-sm font-semibold text-gray-400">Nome</AppText>
                  <AppText className="text-base text-gray-100">{appName}</AppText>
                </View>
              </View>

              {/* Versão */}
              <View className="rounded-xl p-5 bg-white/10 border border-white/10 mb-3 flex-row items-center justify-between">
                <View>
                  <AppText className="text-sm font-semibold text-gray-400">Versão</AppText>
                  <AppText className="text-base text-gray-100">v{appVersion}</AppText>
                </View>
              </View>
            </View>

            {/* Secção: Suporte */}
            <View className="mb-8">
              <AppText className="text-lg font-bold text-gray-100 mb-4">Suporte</AppText>

              {/* Ajuda e Suporte */}
              <TouchableOpacity
                onPress={handleSendEmail}
                className="rounded-xl p-5 bg-white/10 border border-white/10 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <FontAwesome5 name="envelope" size={20} color="#3b82f6" />
                  <View>
                    <AppText className="text-base font-semibold text-blue-400">Contactar Suporte</AppText>
                    <AppText className="text-xs text-gray-100 mt-1">{supportEmail}</AppText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Botão Terminar Sessão */}
            <TouchableOpacity
              onPress={() => setShowLogoutConfirm(true)}
              className="rounded-lg py-3 items-center flex-row justify-center gap-2 mb-8"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              <FontAwesome5 name="sign-out-alt" size={16} color="#ef4444" />
              <AppText className="text-red-400 text-base font-semibold">Terminar Sessão</AppText>
            </TouchableOpacity>
          </ScrollView>
        </PageWrapper>
      </AppLayout>

      {/* Logout Confirm Modal */}
      <ConfirmModal
        visible={showLogoutConfirm}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair da aplicação?"
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        isLoading={isLoggingOut}
        isDangerous={true}
      />
    </>
  );
}
