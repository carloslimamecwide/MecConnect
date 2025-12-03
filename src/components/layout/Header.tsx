import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsDesktop } from "../../hooks/useIsDesktop";

interface HeaderProps {
  title: string;
  onMenuPress?: () => void;
}

export function Header({ title, onMenuPress }: HeaderProps) {
  const isDesktop = useIsDesktop();

  return (
    <SafeAreaView edges={["top"]} className="bg-white border-b border-gray-200">
      <View className="px-4 py-4 flex flex-row items-center justify-between">
        {!isDesktop && (
          <TouchableOpacity onPress={onMenuPress} className="mr-4 p-2 -ml-2">
            <Text className="text-2xl">☰</Text>
          </TouchableOpacity>
        )}

        <Text className="text-xl font-bold text-gray-800 flex-1">{title}</Text>
      </View>
    </SafeAreaView>
  );
}
