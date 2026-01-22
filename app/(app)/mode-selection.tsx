import { AppText } from "@/src/components/Common/AppText";
import { MODE_CARDS } from "@/src/constants/modeCard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";
import { useIsDesktop } from "../../src/hooks/useIsDesktop";

export default function ModeSelectionScreen() {
  const isDesktop = useIsDesktop();

  const handleCardPress = (route: string) => {
    router.replace(route as any);
  };

  return (
    <AppLayout title="Modo de Acesso">
      <PageWrapper>
        <View className="w-full max-w-5xl self-center">
          <View className="mb-8">
            <AppText className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">Escolha o seu modo</AppText>
            <AppText className="text-sm md:text-base text-gray-400">
              Cada modo tem ferramentas específicas para o seu trabalho diário.
            </AppText>
          </View>

          <View className={`gap-4 ${isDesktop ? "grid grid-cols-2" : ""}`}>
            {MODE_CARDS.map((card) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => handleCardPress(card.route)}
                className={`rounded-3xl ${card.borderColor} p-6 overflow-hidden ${isDesktop ? "flex-1" : ""}`}
                style={{ backgroundColor: card.bgColor }}
                activeOpacity={0.85}
              >
                <View className={`absolute -top-8 -right-10 h-24 w-24 rounded-full ${card.topGlowColor}`} />
                <View className={`absolute -bottom-10 -left-10 h-28 w-28 rounded-full ${card.bottomGlowColor}`} />
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View
                      className={`h-12 w-12 rounded-2xl items-center justify-center ${card.iconBgColor} ${card.iconBorderColor}`}
                    >
                      <FontAwesome5 name={card.icon as any} size={18} color={card.iconColor} />
                    </View>
                    <View>
                      <AppText className="text-xl font-bold text-gray-100">{card.title}</AppText>
                      <AppText className="text-xs text-sky-200/80">{card.subtitle}</AppText>
                    </View>
                  </View>
                  <FontAwesome5 name="arrow-right" size={16} color="rgba(255,255,255,0.6)" />
                </View>

                <AppText className="text-sm text-gray-300 mt-4">{card.description}</AppText>

                <View className="flex-row flex-wrap gap-2 mt-4">
                  {card.features.map((feature) => (
                    <View key={feature} className="rounded-full px-3 py-1 bg-white/5 border border-white/10">
                      <AppText className="text-[11px] text-gray-300">{feature}</AppText>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </PageWrapper>
    </AppLayout>
  );
}
