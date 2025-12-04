// src/components/layout/Header.tsx
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { AppText } from "../Common/AppText";

interface HeaderProps {
  title: string;
  onMenuPress?: () => void;
}

export function Header({ title, onMenuPress }: HeaderProps) {
  const isDesktop = useIsDesktop();
  const { logout } = useAuth();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0a1a2b",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
      }}
    >
      {/* Burger só no mobile */}
      {isDesktop && (
        <TouchableOpacity onPress={onMenuPress} style={{ marginRight: 8, padding: 8 }}>
          <Text style={{ fontSize: 24, color: "#FFFFFF" }}>☰</Text>
        </TouchableOpacity>
      )}
      {/* Logo Mecwide totalmente à esquerda */}
      <Image
        source={require("../../../assets/images/LOGOTIPO_MECWIDE_BRANCO.png")}
        style={{ width: 130, height: 60 }}
        resizeMode="contain"
      />
      {/* Título centralizado só em desktop */}
      {isDesktop && (
        <View style={{ flex: 1, alignItems: "center" }}>
          <AppText style={{ fontSize: 20, fontWeight: "bold", color: "#FFFFFF" }} numberOfLines={1}>
            {title}
          </AppText>
        </View>
      )}
      {/* Botão logout totalmente à direita */}
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <TouchableOpacity onPress={logout} style={{ paddingRight: 15 }} accessibilityLabel="Sair">
          <AntDesign name="logout" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
