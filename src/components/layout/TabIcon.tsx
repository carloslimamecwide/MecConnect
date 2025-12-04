import React from "react";
import { Text } from "react-native";

interface TabIconProps {
  icon: string;
  color?: string;
  size?: number;
}

export function TabIcon({ icon, color = "#FFFFFF", size = 24 }: TabIconProps) {
  return <Text style={{ fontSize: size, color }}>{icon}</Text>;
}
