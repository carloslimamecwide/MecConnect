import React, { useState } from "react";
import { View } from "react-native";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title = "MecConnect" }: AppLayoutProps) {
  const isDesktop = useIsDesktop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <View className="flex-1 flex-row bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <View className="flex-1 flex flex-col">
        <Header title={title} onMenuPress={() => setIsSidebarOpen(true)} />

        <View className="flex-1">{children}</View>
      </View>
    </View>
  );
}
