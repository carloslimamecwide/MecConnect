import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Loading = ({message,size}: {message: string, size: "small" | "large"}) => {
  return (
    <View className="flex-1 justify-center items-center bg-slate-100">
      <ActivityIndicator size={size} color="#3b82f6" />
      <Text className="mt-4 text-slate-600">{message}</Text>
    </View>
  );
};

export default Loading;
