import React from "react";
import { Text, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function FormsScreen() {
  return (
    <AppLayout title="Formulários">
      <PageWrapper>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Gestão de Formulários</Text>
          <Text className="text-gray-600">Crie e gerencie formulários da equipa</Text>
        </View>

        <View className="bg-white rounded-lg shadow">
          {["Formulário de Feedback", "Avaliação de Desempenho", "Pedido de Férias"].map((form, idx) => (
            <View key={idx} className="border-b border-gray-200 p-4 last:border-b-0">
              <Text className="font-semibold text-gray-800">{form}</Text>
              <Text className="text-gray-500 text-sm mt-1">Ativo</Text>
            </View>
          ))}
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
