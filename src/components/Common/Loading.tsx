import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Loading = ({ message, size }: { message: string; size: "small" | "large" }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <ActivityIndicator size={size} color="#FFF" />
      <Text className="mt-4 text-slate-100">{message}</Text>
    </View>
  );
};

export default Loading;
