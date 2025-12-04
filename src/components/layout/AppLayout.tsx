// src/components/layout/AppLayout.tsx
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import BrandBackground from "../branding/BrandBackground";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title = "MecConnect" }: AppLayoutProps) {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0a1a2b" }}>
      <StatusBar style="light" backgroundColor="#0a1a2b" translucent={false} />
      {/* Marca d'água em toda a app */}
      <BrandBackground opacity={0.06} />

      {/* Conteúdo por cima do background */}
      <View className="flex-1">
        {/* Header em todas as telas */}
        <Header title={title} onLogoPress={() => router.push("/dashboard")} />

        <View className="flex-1 flex-row">
          {/* Sidebar fixa apenas em desktop */}
          {isDesktop && <Sidebar isOpen={true} onClose={() => {}} />}

          {/* Área de conteúdo */}
          <View className="flex-1">{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}
