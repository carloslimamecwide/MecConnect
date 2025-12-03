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
          <Text className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Bem-vindo ao MecConnect</Text>
          <Text className="text-gray-600 text-sm md:text-base">Painel de administração interno</Text>
        </View>

        <View className="flex flex-row flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <View key={index} className="flex-1 min-w-[140px] md:min-w-[200px]">
              <View className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
                <View className="flex flex-row items-center justify-between mb-3 md:mb-4">
                  <View
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl ${stat.color} items-center justify-center shadow-md`}
                  >
                    <Text className="text-xl md:text-2xl">{stat.icon}</Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-xs md:text-sm font-medium mb-1">{stat.label}</Text>
                <Text className={`text-2xl md:text-4xl font-bold ${stat.textColor}`}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
