import React from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

interface DismissKeyboardProps {
  children: React.ReactNode;
}

export function DismissKeyboard({ children }: DismissKeyboardProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1">{children}</View>
    </TouchableWithoutFeedback>
  );
}
