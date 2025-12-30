import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { AppText } from "./AppText";

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  rows?: number;
  minHeight?: number;
}

export function TextArea({ label, error, rows = 4, minHeight, style, className, ...props }: TextAreaProps) {
  return (
    <View>
      {label && <AppText className="text-sm font-semibold text-gray-300 mb-2 mt-2">{label}</AppText>}
      <TextInput
        multiline
        numberOfLines={rows}
        className={`border border-white/10 bg-white/5 rounded-lg px-3 py-3 text-base ${className || ""}`}
        style={[
          { color: "#FFFFFF", textAlignVertical: "top", outline: "none" } as any,
          minHeight ? { minHeight } : {},
          style,
        ]}
        placeholderTextColor="rgba(255,255,255,0.4)"
        {...props}
      />
      {error && <AppText className="text-red-400 text-xs mt-1">{error}</AppText>}
    </View>
  );
}
