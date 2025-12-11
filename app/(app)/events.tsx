import { AppText } from "@/src/components/Common/AppText";
import React from "react";
import { ScrollView, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function EventsScreen() {
  return (
    <AppLayout title="Eventos">
      <PageWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Eventos</AppText>
            <AppText className="text-gray-300 text-sm md:text-base">Gestão de eventos e atividades</AppText>
          </View>

          <View className="gap-3">
            {["Próximos Eventos", "Eventos Passados", "Criar Evento", "Minhas Inscrições"].map((item, idx) => (
              <View key={idx} className="rounded-xl p-5 bg-white/10 border border-white/10">
                <AppText className="font-semibold text-gray-100">{item}</AppText>
              </View>
            ))}
          </View>
        </ScrollView>
      </PageWrapper>
    </AppLayout>
  );
}
