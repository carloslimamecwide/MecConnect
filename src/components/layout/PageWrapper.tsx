import React from "react";
import { ScrollView, View } from "react-native";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <ScrollView className="flex-1">
      <View className="pl-4 pr-4 md:p-6 lg:p-8">{children}</View>
    </ScrollView>
  );
}
