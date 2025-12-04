// src/components/layout/Header.tsx
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { AppText } from "../Common/AppText";

interface HeaderProps {
  title: string;
  onLogoPress?: () => void;
}

export function Header({ title, onLogoPress }: HeaderProps) {
  const isDesktop = useIsDesktop();
  const { logout } = useAuth();

  return (
    <View className="flex-row items-center bg-[#0a1a2b] border-b border-white/10 px-2.5">
      {/* Logo Mecwide */}
      <TouchableOpacity onPress={onLogoPress} accessibilityLabel="Logo Mecwide">
        <Image
          source={require("../../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
          style={{ width: 130, height: 60 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Título centralizado só em desktop */}
      {isDesktop && (
        <View className="flex-1 items-center">
          <AppText className="text-xl font-bold text-white" numberOfLines={1}>
            {title}
          </AppText>
        </View>
      )}

      {/* Botão logout */}
      {!isDesktop ? (
        <View className="flex-1 items-end">
          <TouchableOpacity onPress={logout} className="pr-3.75" accessibilityLabel="Sair">
            <AntDesign name="logout" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
