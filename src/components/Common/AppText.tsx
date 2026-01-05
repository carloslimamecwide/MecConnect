import React from "react";
import { Platform, Text, TextProps } from "react-native";

export function AppText({ allowFontScaling, className, ...props }: TextProps) {
  return (
    <Text
      {...props}
      allowFontScaling={allowFontScaling ?? Platform.OS !== "android"}
      className={[className, "font-sans"].filter(Boolean).join(" ")}
    />
  );
}
