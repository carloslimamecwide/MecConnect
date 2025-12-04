import { router, usePathname } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { AppText } from "../Common/AppText";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/forms", label: "Formulários", icon: "📝" },
  { href: "/notifications", label: "Notificações", icon: "🔔" },
  { href: "/settings", label: "Definições", icon: "⚙️" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isDesktop = useIsDesktop();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!isDesktop && !isOpen) {
    return null;
  }

  return (
    <>
      <View
        style={{
          width: isDesktop ? 280 : "100%",
          backgroundColor: "#0a1a2b",
          borderRightWidth: 1,
          borderRightColor: "rgba(255,255,255,0.1)",
          position: isDesktop ? "relative" : "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 50,
        }}
        className="flex flex-col"
      >
        <View className="p-6 border-b border-white/10">
          <View className="flex flex-row items-center justify-between">
            <AppText className="text-2xl font-bold text-gray-100">MecConnect</AppText>
            <AppText className="text-xs font-bold" style={{ color: "#0066CC" }}>
              MECWIDE
            </AppText>
          </View>
        </View>

        <ScrollView className="flex-1 py-3" showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <TouchableOpacity
                key={item.href}
                onPress={() => {
                  router.push(item.href as any);
                  if (!isDesktop) onClose();
                }}
                className="mx-3 mb-2 rounded-xl overflow-hidden"
                activeOpacity={0.7}
              >
                <View
                  className="flex flex-row items-center px-4 py-3"
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  <View
                    className="w-9 h-9 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <Text className="text-xl">{item.icon}</Text>
                  </View>
                  <AppText className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-300"}`}>
                    {item.label}
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View className="p-4 border-t border-white/10" style={{ paddingBottom: isDesktop ? 16 : 34 }}>
          <View className="bg-white/5 rounded-xl p-3 mb-3">
            <View className="flex flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: "#0066CC" }}
              >
                <Text className="text-white font-bold text-lg">{user?.nome?.charAt(0)?.toUpperCase() || "U"}</Text>
              </View>
              <View className="flex-1">
                <AppText className="text-gray-100 text-sm font-semibold" numberOfLines={1}>
                  {user?.nome || "Utilizador"}
                </AppText>
                <AppText className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
                  {user?.desc_job || "Colaborador"}
                </AppText>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace("/login" as any);
            }}
            className="rounded-xl py-3 items-center"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderWidth: 1, borderColor: "rgba(239, 68, 68, 0.3)" }}
            activeOpacity={0.7}
          >
            <AppText className="text-red-400 text-sm font-semibold">🚪 Sair</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
