// src/components/layout/Header.tsx
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { AppText } from "../Common/AppText";
import { ConfirmModal } from "../Common/ConfirmModal";

interface HeaderProps {
  title: string;
  onLogoPress?: () => void;
}

export function Header({ title, onLogoPress }: HeaderProps) {
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
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
            <TouchableOpacity onPress={() => setShowLogoutConfirm(true)} className="pr-3.75" accessibilityLabel="Sair">
              <AntDesign name="logout" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Logout Confirm Modal */}
      <ConfirmModal
        visible={showLogoutConfirm}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair da aplicação?"
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        isLoading={isLoggingOut}
        isDangerous={true}
      />
    </>
  );
}
