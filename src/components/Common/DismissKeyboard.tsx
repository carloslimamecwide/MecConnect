import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback, View } from "react-native";

interface DismissKeyboardProps {
  children: React.ReactNode;
}

export function DismissKeyboard({ children }: DismissKeyboardProps) {
  // Em web, não usar TouchableWithoutFeedback pois interfere com inputs
  if (Platform.OS === "web") {
    return <View className="flex-1">{children}</View>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1">{children}</View>
    </TouchableWithoutFeedback>
  );
}
