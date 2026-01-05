import { AppText } from "@/src/components/Common/AppText";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";

export default function UsersScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout title="Gestão de Usuários">
        <PageWrapper>
          <View className="mb-8">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 items-center justify-center">
                <FontAwesome5 name="users" size={18} color="#60a5fa" />
              </View>
              <View>
                <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">
                  Gestão de Usuários
                </AppText>
                <AppText className="text-sm text-gray-400">Painel de administração de usuários</AppText>
              </View>
            </View>

            <View className="mt-8 rounded-xl bg-white/5 border border-white/10 p-8 items-center">
              <FontAwesome5 name="tools" size={48} color="rgba(255,255,255,0.3)" />
              <AppText className="text-gray-300 mt-4 text-center text-lg font-semibold">
                Em Desenvolvimento
              </AppText>
              <AppText className="text-gray-400 mt-2 text-center">
                Esta funcionalidade estará disponível em breve.
              </AppText>
            </View>
          </View>
        </PageWrapper>
      </AppLayout>
    </GestureHandlerRootView>
  );
}
