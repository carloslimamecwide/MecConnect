// src/components/layout/AppLayout.tsx
import { useToast } from "@/src/contexts/ToastContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useConnectivity } from "../../hooks/useConnectivity";
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
  const { isOffline } = useConnectivity();
  const { showToast } = useToast();
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setWasOffline(true);
      showToast({ message: "Sem conexão com a Internet", type: "error", position: "top", autoHide: false });
    } else if (wasOffline) {
      // Voltou online
      setWasOffline(false);
      showToast({ message: "Conexão restaurada", type: "success", position: "top", autoHide: true, duration: 2500 });
    }
  }, [isOffline, wasOffline]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#0a1a2b" }} edges={["top", "left", "right"]}>
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
