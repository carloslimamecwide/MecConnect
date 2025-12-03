import React from "react";
import { Text, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function UsersScreen() {
  return (
    <AppLayout title="Utilizadores">
      <PageWrapper>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Gestão de Utilizadores</Text>
          <Text className="text-gray-600">Lista de utilizadores do sistema</Text>
        </View>

        <View className="bg-white rounded-lg shadow">
          {[
            { name: "Test User", role: "Administrador", status: "Ativo" },
            { name: "João Silva", role: "Colaborador", status: "Ativo" },
            { name: "Maria Costa", role: "Superior Hierárquico", status: "Ativo" },
          ].map((user, idx) => (
            <View key={idx} className="border-b border-gray-200 p-4 last:border-b-0">
              <Text className="font-semibold text-gray-800">{user.name}</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {user.role} • {user.status}
              </Text>
            </View>
          ))}
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
