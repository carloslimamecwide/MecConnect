import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: "/(app)/dashboard", label: "Dashboard", icon: "📊", color: "bg-blue-500" },
  { href: "/(app)/forms", label: "Formulários", icon: "📝", color: "bg-green-500" },
  { href: "/(app)/notifications", label: "Notificações", icon: "🔔", color: "bg-yellow-500" },
  { href: "/(app)/users", label: "Utilizadores", icon: "👥", color: "bg-purple-500" },
  { href: "/(app)/settings", label: "Definições", icon: "⚙️", color: "bg-gray-500" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isDesktop = useIsDesktop();
  const { user, logout } = useAuth();

  if (!isDesktop && !isOpen) {
    return null;
  }

  return (
    <>
      <View
        className={`
          ${isDesktop ? "relative" : "absolute left-0 top-0 bottom-0 z-50"}
          flex flex-col shadow-2xl bg-white border-r border-gray-200
        `}
        style={{
          paddingTop: isDesktop ? 44 : 0,
          width: isDesktop ? 280 : "100%",
        }}
      >
        <View className="p-6 border-b border-gray-200">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center flex-1">
              <View className="mr-3">
                <Text className="text-3xl font-bold" style={{ color: "#0066CC" }}>
                  mecwide
                </Text>
                <Text className="text-xs font-semibold" style={{ color: "#FF6B00" }}>
                  CONNECT
                </Text>
              </View>
            </View>
            {!isDesktop && (
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text className="text-gray-600 text-2xl">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView className="flex-1 py-2" showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.href}
              onPress={() => {
                router.push(item.href as any);
                if (!isDesktop) onClose();
              }}
              className="mx-2 mb-1 rounded-xl overflow-hidden active:opacity-80"
            >
              <View className="flex flex-row items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 active:bg-gray-100">
                <View className={`w-9 h-9 rounded-lg ${item.color} items-center justify-center mr-3`}>
                  <Text className="text-xl">{item.icon}</Text>
                </View>
                <Text className="text-gray-900 text-sm font-medium">{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="p-4 border-t border-gray-200" style={{ paddingBottom: isDesktop ? 16 : 34 }}>
          <View className="bg-gray-50 rounded-xl p-3 mb-3">
            <View className="flex flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: "#3b82f6" }}
              >
                <Text className="text-white font-bold text-lg">{user?.nome?.charAt(0)?.toUpperCase() || "U"}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 text-sm font-semibold" numberOfLines={1}>
                  {user?.nome || "Utilizador"}
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>
                  {user?.desc_job || "Colaborador"}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace("/(auth)/login" as any);
            }}
            className="bg-red-50 border border-red-200 rounded-xl py-3 items-center active:bg-red-100"
          >
            <Text className="text-red-600 text-sm font-semibold">🚪 Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
