import React from "react";
import { Text, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function NotificationsScreen() {
  return (
    <AppLayout title="Notificações">
      <PageWrapper>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Central de Notificações</Text>
          <Text className="text-gray-600">Gerencie notificações enviadas</Text>
        </View>

        <View className="bg-white rounded-lg shadow">
          {[
            { title: "Nova atualização disponível", time: "Há 2 horas" },
            { title: "Formulário submetido", time: "Há 5 horas" },
            { title: "Novo utilizador registado", time: "Ontem" },
          ].map((notif, idx) => (
            <View key={idx} className="border-b border-gray-200 p-4 last:border-b-0">
              <Text className="font-semibold text-gray-800">{notif.title}</Text>
              <Text className="text-gray-500 text-sm mt-1">{notif.time}</Text>
            </View>
          ))}
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
