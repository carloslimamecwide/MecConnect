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
      <View className="flex-row items-center bg-[#0a1a2b] border-b border-white/10 px-2.5">
        {/* Logo Mecwide */}
        <TouchableOpacity onPress={onLogoPress} accessibilityLabel="Logo Mecwide">
          <Image
            source={require("../../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
            style={{ width: isDesktop ? 200 : 130, height: isDesktop ? 80 : 60 }}
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
      </View>
    </>
  );
}
