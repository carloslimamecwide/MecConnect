import { AppText } from "@/src/components/Common/AppText";
import React from "react";
import { ScrollView, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function NotificationsScreen() {
  return (
    <AppLayout title="Notificações">
      <PageWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Central de Notificações</AppText>
            <AppText className="text-gray-300 text-sm md:text-base">Gerencie notificações enviadas</AppText>
          </View>

          <View className="gap-3">
            {[
              { title: "Nova atualização disponível", time: "Há 2 horas" },
              { title: "Formulário submetido", time: "Há 5 horas" },
              { title: "Novo utilizador registado", time: "Ontem" },
            ].map((notif, idx) => (
              <View key={idx} className="rounded-xl p-5 bg-white/10 border border-white/10">
                <AppText className="font-semibold text-gray-100 mb-1">{notif.title}</AppText>
                <AppText className="text-gray-400 text-sm">{notif.time}</AppText>
              </View>
            ))}
          </View>
        </ScrollView>
      </PageWrapper>
    </AppLayout>
  );
}
