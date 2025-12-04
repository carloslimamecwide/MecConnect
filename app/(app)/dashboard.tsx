import { AppText } from "@/src/components/Common/AppText";
import React from "react";
import { ScrollView, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function DashboardScreen() {
  const stats = [
    {
      label: "Formulários",
      value: "24",
      icon: "📝",
      bgOpacity: "bg-white/10",
      textColor: "text-gray-100",
    },
    {
      label: "Notificações",
      value: "12",
      icon: "🔔",
      bgOpacity: "bg-white/10",
      textColor: "text-gray-100",
    },
    {
      label: "Utilizadores",
      value: "156",
      icon: "👥",
      bgOpacity: "bg-white/10",
      textColor: "text-gray-100",
    },
    {
      label: "Relatórios",
      value: "8",
      icon: "📊",
      bgOpacity: "bg-white/10",
      textColor: "text-gray-100",
    },
  ];

  return (
    <AppLayout title="Dashboard">
      <PageWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Cabeçalho */}
          <View className="mb-8">
            <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Bem-vindo ao MecConnect</AppText>
            <AppText className="text-gray-300 text-sm md:text-base">Painel de administração interno</AppText>
          </View>

          {/* Stats Grid */}
          <View className="gap-4">
            {stats.map((stat, index) => (
              <View
                key={index}
                className={`rounded-xl p-6 flex-row items-center justify-between border border-white/10 ${stat.bgOpacity}`}
              >
                <View className="flex-1">
                  <AppText className="text-sm font-semibold text-gray-400 mb-1">{stat.label}</AppText>
                  <AppText className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</AppText>
                </View>
                <AppText className="text-4xl opacity-70">{stat.icon}</AppText>
              </View>
            ))}
          </View>

          {/* Espaço para mais conteúdo */}
          <View className="mt-8 mb-4">
            <AppText className="text-lg font-bold text-gray-100 mb-4">Últimas Atividades</AppText>
            <View className="bg-gray-800 rounded-lg p-4">
              <AppText className="text-gray-400 text-sm">Nenhuma atividade recente</AppText>
            </View>
          </View>
        </ScrollView>
      </PageWrapper>
    </AppLayout>
  );
}
