import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface BackHeaderProps {
  children?: React.ReactNode;
  onBack?: () => void;
  iconColor?: string;
  iconSize?: number;
}

export const BackHeader: React.FC<BackHeaderProps> = ({ children, onBack, iconColor = "#fff", iconSize = 24 }) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center mb-3">
      <TouchableOpacity onPress={onBack ? onBack : () => router.back()} accessibilityLabel="Voltar" className="mr-2">
        <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
      </TouchableOpacity>
      {children}
    </View>
  );
};
