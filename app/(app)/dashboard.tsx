import React from "react";
import { Text, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function DashboardScreen() {
  return (
    <AppLayout title="Dashboard">
      <PageWrapper>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo ao MecConnect</Text>
          <Text className="text-gray-600">Painel de administração interno</Text>
        </View>

        <View className="flex flex-row flex-wrap gap-4">
          <View className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
            <Text className="text-gray-500 text-sm mb-2">Formulários</Text>
            <Text className="text-3xl font-bold text-blue-600">24</Text>
          </View>

          <View className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
            <Text className="text-gray-500 text-sm mb-2">Notificações</Text>
            <Text className="text-3xl font-bold text-green-600">12</Text>
          </View>

          <View className="flex-1 min-w-[200px] bg-white rounded-lg shadow p-6">
            <Text className="text-gray-500 text-sm mb-2">Utilizadores</Text>
            <Text className="text-3xl font-bold text-purple-600">156</Text>
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</Text>

          <View className="bg-white rounded-lg shadow">
            {[1, 2, 3].map((item) => (
              <View key={item} className="border-b border-gray-200 p-4 last:border-b-0">
                <Text className="font-semibold text-gray-800">Atividade #{item}</Text>
                <Text className="text-gray-500 text-sm mt-1">Descrição da atividade recente</Text>
              </View>
            ))}
          </View>
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
