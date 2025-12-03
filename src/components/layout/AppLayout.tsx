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
    <View className="flex-1 bg-gray-50">
      <Header title={title} onMenuPress={() => setIsSidebarOpen(!isSidebarOpen)} />

      <View className="flex-1 flex-row">
        {isDesktop && <Sidebar isOpen={true} onClose={() => {}} />}

        <View className="flex-1">{children}</View>

        {!isDesktop && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      </View>
    </View>
  );
}
