import { AppText } from "@/src/components/Common/AppText";
import AppTitle from "@/src/components/Common/AppTitle";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import { useAuth } from "../../../src/contexts/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const appName = Constants.expoConfig?.name || "MecConnect";

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

  return (
    <>
      <AppLayout title="Definições">
        <PageWrapper>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-6">
              <AppTitle title="Definições da Aplicação" iconName="cog" />
              <View className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="h-2 w-2 rounded-full bg-emerald-400" />
                  <AppText className="text-xs text-gray-300">Sessão ativa</AppText>
                </View>
                <AppText className="text-xs text-gray-400">v{appVersion}</AppText>
              </View>
            </View>

            {/* Secção: Conta / Perfil */}
            <View className="mb-6">
              <AppText className="text-lg font-bold text-gray-100 mb-4">Conta</AppText>

              <View className="rounded-2xl bg-white/5 border border-white/10">
                <View className="p-4 flex-row items-center gap-3">
                  <View className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-400/30 items-center justify-center">
                    <FontAwesome5 name="user" size={14} color="#60a5fa" />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-sm font-semibold text-gray-400">Utilizador</AppText>
                    <AppText className="text-base font-semibold text-gray-100">
                      {user?.nome || "Utilizador Desconhecido"}
                    </AppText>
                    {user?.email_prof && <AppText className="text-xs text-gray-500 mt-1">{user.email_prof}</AppText>}
                  </View>
                </View>

                {user?.desc_job && (
                  <View className="border-t border-white/10 p-4 flex-row items-center gap-3">
                    <View className="h-9 w-9 rounded-full bg-white/5 border border-white/10 items-center justify-center">
                      <FontAwesome5 name="briefcase" size={12} color="#9ca3af" />
                    </View>
                    <View className="flex-1">
                      <AppText className="text-xs text-gray-400">Cargo</AppText>
                      <AppText className="text-sm text-gray-100">{user.desc_job}</AppText>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Secção: Aplicação / Sobre */}
            <View className="mb-6">
              <AppText className="text-lg font-bold text-gray-100 mb-4">Aplicação</AppText>

              <View className="rounded-2xl bg-white/5 border border-white/10">
                <View className="p-4 flex-row items-center gap-3">
                  <View className="h-9 w-9 rounded-full bg-white/5 border border-white/10 items-center justify-center">
                    <FontAwesome5 name="cube" size={12} color="#9ca3af" />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-xs text-gray-400">Nome</AppText>
                    <AppText className="text-sm text-gray-100">{appName}</AppText>
                  </View>
                </View>
                <View className="border-t border-white/10 p-4 flex-row items-center gap-3">
                  <View className="h-9 w-9 rounded-full bg-white/5 border border-white/10 items-center justify-center">
                    <FontAwesome5 name="code-branch" size={12} color="#9ca3af" />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-xs text-gray-400">Versão</AppText>
                    <AppText className="text-sm text-gray-100">v{appVersion}</AppText>
                  </View>
                </View>
              </View>
            </View>

            {/* Secção: Suporte */}
            <View className="mb-8">
              <AppText className="text-lg font-bold text-gray-100 mb-4">Suporte</AppText>

              <TouchableOpacity
                onPress={() => router.push("/support")}
                className="rounded-2xl p-5 bg-white/5 border border-white/10 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-400/30 items-center justify-center">
                    <FontAwesome5 name="envelope" size={14} color="#60a5fa" />
                  </View>
                  <View>
                    <AppText className="text-base font-semibold text-gray-100">Contactar Suporte</AppText>
                    <AppText className="text-xs text-gray-400">Resposta por email</AppText>
                  </View>
                </View>
                <FontAwesome5 name="chevron-right" size={14} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>

            {/* Botão Terminar Sessão */}
            <Button
              title="Terminar Sessão"
              variant="danger"
              icon="sign-out-alt"
              onPress={() => setShowLogoutConfirm(true)}
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(239, 68, 68, 0.35)",
              }}
              className="mb-8"
            />
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
