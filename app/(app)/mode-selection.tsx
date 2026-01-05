import { AppText } from "@/src/components/Common/AppText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";
import { useIsDesktop } from "../../src/hooks/useIsDesktop";

export default function ModeSelectionScreen() {
  const isDesktop = useIsDesktop();

  return (
    <AppLayout title="Modo de Acesso">
      <PageWrapper>
        <View className="w-full max-w-5xl self-center">
          <View className="mb-8">
            <AppText className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">Escolha o seu modo</AppText>
            <AppText className="text-sm md:text-base text-gray-400">
              Cada modo tem ferramentas específicas para o seu trabalho diário.
            </AppText>
          </View>

          <View className={`gap-4 ${isDesktop ? "flex-row" : ""}`}>
            <TouchableOpacity
              onPress={() => router.replace("/(app)/(communication)/dashboard" as any)}
              className={`rounded-3xl border border-white/10 p-6 overflow-hidden ${isDesktop ? "flex-1" : ""}`}
              style={{ backgroundColor: "rgba(2,132,199,0.12)" }}
              activeOpacity={0.85}
            >
              <View className="absolute -top-8 -right-10 h-24 w-24 rounded-full bg-sky-400/20" />
              <View className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-blue-500/20" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 rounded-2xl items-center justify-center bg-sky-500/20 border border-sky-400/30">
                    <FontAwesome5 name="bullhorn" size={18} color="#7dd3fc" />
                  </View>
                  <View>
                    <AppText className="text-xl font-bold text-gray-100">Comunicação</AppText>
                    <AppText className="text-xs text-sky-200/80">Campanhas e conteúdos</AppText>
                  </View>
                </View>
                <FontAwesome5 name="arrow-right" size={16} color="rgba(255,255,255,0.6)" />
              </View>

              <AppText className="text-sm text-gray-300 mt-4">
                Gerir formulários, eventos, rewards e notificações com impacto.
              </AppText>

              <View className="flex-row flex-wrap gap-2 mt-4">
                {["Formulários", "Eventos", "Rewards", "Notificações"].map((item) => (
                  <View key={item} className="rounded-full px-3 py-1 bg-white/5 border border-white/10">
                    <AppText className="text-[11px] text-gray-300">{item}</AppText>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/(app)/(management)/users" as any)}
              className={`rounded-3xl border border-white/10 p-6 overflow-hidden ${isDesktop ? "flex-1" : ""}`}
              style={{ backgroundColor: "rgba(16,185,129,0.12)" }}
              activeOpacity={0.85}
            >
              <View className="absolute -top-10 -left-8 h-24 w-24 rounded-full bg-emerald-400/20" />
              <View className="absolute -bottom-12 -right-10 h-28 w-28 rounded-full bg-emerald-500/20" />
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 rounded-2xl items-center justify-center bg-emerald-500/20 border border-emerald-400/30">
                    <FontAwesome5 name="users-cog" size={18} color="#34d399" />
                  </View>
                  <View>
                    <AppText className="text-xl font-bold text-gray-100">Gestão</AppText>
                    <AppText className="text-xs text-emerald-200/80">Administração interna</AppText>
                  </View>
                </View>
                <FontAwesome5 name="arrow-right" size={16} color="rgba(255,255,255,0.6)" />
              </View>

              <AppText className="text-sm text-gray-300 mt-4">
                Controlar utilizadores, permissões e configurações avançadas.
              </AppText>

              <View className="flex-row flex-wrap gap-2 mt-4">
                {["Utilizadores", "Permissões", "Definições"].map((item) => (
                  <View key={item} className="rounded-full px-3 py-1 bg-white/5 border border-white/10">
                    <AppText className="text-[11px] text-gray-300">{item}</AppText>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
