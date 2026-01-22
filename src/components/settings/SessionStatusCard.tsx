import React from "react";
import { View } from "react-native";
import { AppText } from "../Common/AppText";

type SessionStatusCardProps = {
  appVersion?: string;
};

function SessionStatusCard({ appVersion }: SessionStatusCardProps) {
  return (
    <View className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-emerald-400" />
        <AppText className="text-xs text-gray-300">Sessão ativa</AppText>
      </View>
      <AppText className="text-xs text-gray-400">v{appVersion}</AppText>
    </View>
  );
}

export default SessionStatusCard;
