import React from "react";
import { Text, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function SettingsScreen() {
  return (
    <AppLayout title="Definições">
      <PageWrapper>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Definições da Aplicação</Text>
          <Text className="text-gray-600">Configure preferências e parâmetros</Text>
        </View>

        <View className="bg-white rounded-lg shadow">
          {["Perfil de Utilizador", "Notificações", "Privacidade", "Sobre"].map((setting, idx) => (
            <View key={idx} className="border-b border-gray-200 p-4 last:border-b-0">
              <Text className="font-semibold text-gray-800">{setting}</Text>
            </View>
          ))}
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
