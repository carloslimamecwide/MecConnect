import { AppText } from "@/src/components/Common/AppText";
import React from "react";
import { ScrollView, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";

export default function RewardsScreen() {
  return (
    <AppLayout title="Rewards">
      <PageWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Rewards</AppText>
            <AppText className="text-gray-300 text-sm md:text-base">Sistema de recompensas e benefícios</AppText>
          </View>

          <View className="gap-3">
            {["Pontos Acumulados", "Recompensas Disponíveis", "Histórico", "Resgatar"].map((item, idx) => (
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
