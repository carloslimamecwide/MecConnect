import React from "react";
import { Text, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function DashboardScreen() {
  const stats = [
    {
      label: "Formulários",
      value: "24",
      icon: "📝",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Notificações",
      value: "12",
      icon: "🔔",
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Utilizadores",
      value: "156",
      icon: "👥",
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <AppLayout title="Dashboard">
      <PageWrapper>
        <View className="mb-6 md:mb-8">
          <Text className="text-2xl md:text-3xl font-bold text-gray-100 mb-1 md:mb-2">Bem-vindo ao MecConnect</Text>
          <Text className="text-gray-100 text-sm md:text-base">Painel de administração interno</Text>
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
