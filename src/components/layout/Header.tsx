// src/components/layout/Header.tsx
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { AppText } from "../Common/AppText";

interface HeaderProps {
  title: string;
  onLogoPress?: () => void;
}

export function Header({ title, onLogoPress }: HeaderProps) {
  const isDesktop = useIsDesktop();

  return (
    <>
      <View className="flex-row items-center bg-[#0a1a2b] border-b border-white/10 px-2 py-2">
        {/* Logo Mecwide */}
        <TouchableOpacity onPress={onLogoPress} accessibilityLabel="Logo Mecwide">
          <Image
            source={require("../../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
            style={{ width: isDesktop ? 190 : 120, height: isDesktop ? 70 : 46 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Título (desktop) e contexto do header */}
        {isDesktop ? (
          <View className="flex-1 items-center">
            <AppText className="text-lg font-semibold text-white" numberOfLines={1}>
              {title}
            </AppText>
          </View>
        ) : (
          <View className="flex-1 items-end pr-1">
            <View className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <AppText className="text-[10px] text-blue-200 uppercase tracking-[2px]">Admin</AppText>
            </View>
          </View>
        )}
      </View>
    </>
  );
}
