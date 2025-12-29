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
        className={`border-b border-slate-400 px-0 py-3 text-base ${className || ""}`}
        style={[{ color: "#FFFFFF", outline: "none" } as any, style]}
        placeholderTextColor="rgba(255,255,255,0.3)"
        {...props}
      />
      {error && <AppText className="text-red-400 text-xs mt-1">{error}</AppText>}
    </View>
  );
}
