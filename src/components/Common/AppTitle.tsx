import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { AppText } from "../Common/AppText";

type AppTitleProps = {
  title: string;
  iconName?: string;
};

function AppTitle({ title, iconName = "cog" }: AppTitleProps) {
  return (
    <View className="flex-row items-center gap-3 mb-4">
      <View className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 items-center justify-center">
        <FontAwesome5 name={iconName} size={18} color="#60a5fa" />
      </View>
      <View className="flex-1">
        <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">{title}</AppText>
      </View>
    </View>
  );
}

export default AppTitle;
