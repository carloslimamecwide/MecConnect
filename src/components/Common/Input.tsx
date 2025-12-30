import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { AppText } from "./AppText";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, className, ...props }: InputProps) {
  return (
    <View>
      {label && <AppText className="text-sm font-semibold text-gray-300 mb-2">{label}</AppText>}
      <TextInput
        className={`border border-white/10 bg-white/5 rounded-lg px-3 py-3 text-base ${className || ""}`}
        style={[{ color: "#FFFFFF", outline: "none" } as any, style]}
        placeholderTextColor="rgba(255,255,255,0.4)"
        {...props}
      />
      {error && <AppText className="text-red-400 text-xs mt-1">{error}</AppText>}
    </View>
  );
}
