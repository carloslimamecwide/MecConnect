import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: "/(app)/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/(app)/forms", label: "Formulários", icon: "📝" },
  { href: "/(app)/notifications", label: "Notificações", icon: "🔔" },
  { href: "/(app)/users", label: "Utilizadores", icon: "👥" },
  { href: "/(app)/settings", label: "Definições", icon: "⚙️" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const isDesktop = useIsDesktop();
  const { user, logout } = useAuth();

  if (!isDesktop && !isOpen) {
    return null;
  }

  return (
    <>
      {!isDesktop && isOpen && <Pressable onPress={onClose} className="absolute inset-0 bg-black/50 z-40" />}

      <View
        className={`
          ${isDesktop ? "relative" : "absolute left-0 top-0 bottom-0 z-50"}
          bg-slate-800 w-64 flex flex-col
        `}
      >
        <View className="p-4 border-b border-slate-700">
          <Text className="text-white text-xl font-bold">MecConnect</Text>
          <Text className="text-slate-400 text-sm">Admin Panel</Text>
        </View>

        <ScrollView className="flex-1 py-4">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.href}
              onPress={() => {
                router.push(item.href as any);
                if (!isDesktop) onClose();
              }}
              className="flex flex-row items-center px-4 py-3 hover:bg-slate-700 active:bg-slate-700"
            >
              <Text className="text-2xl mr-3">{item.icon}</Text>
              <Text className="text-white text-base">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="p-4 border-t border-slate-700">
          <View className="flex flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-slate-600 items-center justify-center mr-3">
              <Text className="text-white font-bold">{user?.name.charAt(0) || "U"}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">{user?.name || "Utilizador"}</Text>
              <Text className="text-slate-400 text-xs">{user?.job || "Colaborador"}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace("/(auth)/login" as any);
            }}
            className="bg-slate-700 rounded-lg py-2 items-center"
          >
            <Text className="text-white text-sm font-semibold">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
