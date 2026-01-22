import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Loading = ({ message, size, color }: { message: string; size: "small" | "large"; color?: string }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={color || "#60a5fa"} />
      <Text className="mt-4 text-slate-100">{message}</Text>
    </View>
  );
};

export default Loading;
