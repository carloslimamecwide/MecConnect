import { AppText } from "@/src/components/Common/AppText";
import AppTitle from "@/src/components/Common/AppTitle";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { ApplicationSection } from "@/src/components/settings/ApplicationSection";
import SessionStatusCard from "@/src/components/settings/SessionStatusCard";
import { SupportSection } from "@/src/components/settings/SupportSection";
import UserSection from "@/src/components/settings/UserSection";
import React from "react";
import { ScrollView, View } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import useSettings from "../../../src/hooks/useSettings";

export default function SettingsScreen() {
  const {
    user,
    appVersion,
    appName,
    router,
    showLogoutConfirm,
    setShowLogoutConfirm,
    isLoggingOut,
    handleLogoutConfirm,
  } = useSettings();

  return (
    <>
      <AppLayout title="Definições">
        <PageWrapper>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-8">
              <View className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-5">
                <View className="relative">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <AppTitle title="Definições da Aplicação" iconName="cog" />
                      <AppText className="text-xs text-gray-400 mt-2">
                        Gerencie conta, aplicação e suporte num só lugar.
                      </AppText>
                    </View>
                  </View>
                  <View className="mt-4">
                    <SessionStatusCard appVersion={appVersion} />
                  </View>
                </View>
              </View>
            </View>
            {/* Secção: Conta / Perfil */}
            <UserSection user={user} />
            {/* Secção: Aplicação / Sobre */}
            <ApplicationSection appName={appName} appVersion={appVersion} />
            {/* Secção: Suporte */}
            <SupportSection onPress={() => router.push("/support")} />
            {/* Botão Terminar Sessão */}

            <Button
              title="Terminar Sessão"
              variant="danger"
              icon="sign-out-alt"
              onPress={() => setShowLogoutConfirm(true)}
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
