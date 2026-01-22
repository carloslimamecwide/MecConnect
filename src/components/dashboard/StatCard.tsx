import { AppText } from "@/src/components/Common/AppText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Platform, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  tone: string;
  text: string;
}

export function StatCard({ label, value, icon, tone, text }: StatCardProps) {
  return (
    <View
      className={`rounded-2xl p-5 border ${tone} flex-row items-center justify-between`}
      style={Platform.OS === "web" ? { flexGrow: 1, flexBasis: 240, minWidth: 220 } : undefined}
    >
      <View>
        <AppText className="text-xs text-gray-400 mb-1">{label}</AppText>
        <AppText className={`text-3xl font-bold ${text}`}>{value}</AppText>
      </View>
      <FontAwesome5 name={icon} size={24} color="rgba(255,255,255,0.6)" />
    </View>
  );
}
