import React from "react";
import { Text, TextProps } from "react-native";

export function AppText(props: TextProps) {
  return <Text {...props} className={[props.className, "font-sans"].filter(Boolean).join(" ")} />;
}
