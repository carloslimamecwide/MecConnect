import { AppText } from "@/src/components/Common/AppText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModeSelectionScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a1a2b" }}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-12">
          <AppText className="text-4xl font-bold text-gray-100 text-center mb-3">MecConnect</AppText>
          <AppText className="text-lg text-gray-400 text-center">Selecione o modo de acesso</AppText>
        </View>

        <View className="w-full max-w-md gap-4">
          <TouchableOpacity
            onPress={() => router.replace("/(app)/(communication)/dashboard" as any)}
            className="rounded-2xl p-6 border border-white/10"
            style={{ backgroundColor: "rgba(0,102,204,0.1)" }}
            activeOpacity={0.8}
          >
            <View className="items-center">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(0,102,204,0.2)" }}
              >
                <FontAwesome5 name="bullhorn" size={32} color="#60a5fa" />
              </View>
              <AppText className="text-2xl font-bold text-gray-100 mb-2">Comunicação</AppText>
              <AppText className="text-sm text-gray-400 text-center">
                Gerir formulários, eventos, rewards e notificações
              </AppText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(app)/(management)/users" as any)}
            className="rounded-2xl p-6 border border-white/10"
            style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
            activeOpacity={0.8}
          >
            <View className="items-center">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "rgba(16,185,129,0.2)" }}
              >
                <FontAwesome5 name="users-cog" size={32} color="#10b981" />
              </View>
              <AppText className="text-2xl font-bold text-gray-100 mb-2">Gestão</AppText>
              <AppText className="text-sm text-gray-400 text-center">
                Administração de usuários e configurações avançadas
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
