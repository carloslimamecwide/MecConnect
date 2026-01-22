import { User } from "@/src/types/auth";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { View } from "react-native";
import { AppText } from "../Common/AppText";

type Props = {
  user: User | null;
};

function UserSection({ user }: Props) {
  return (
    <View className="mb-6">
      <AppText className="text-lg font-bold text-gray-100 mb-4">Conta</AppText>

      <View className="rounded-2xl bg-white/5 border border-white/10">
        <View className="p-4 flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-400/30 items-center justify-center">
            <FontAwesome5 name="user" size={14} color="#60a5fa" />
          </View>
          <View className="flex-1">
            <AppText className="text-sm font-semibold text-gray-400">Utilizador</AppText>
            <AppText className="text-base font-semibold text-gray-100">
              {user?.nome || "Utilizador Desconhecido"}
            </AppText>
            {user?.email_prof && <AppText className="text-xs text-gray-500 mt-1">{user.email_prof}</AppText>}
          </View>
        </View>

        {user?.desc_job && (
          <View className="border-t border-white/10 p-4 flex-row items-center gap-3">
            <View className="h-9 w-9 rounded-full bg-white/5 border border-white/10 items-center justify-center">
              <FontAwesome5 name="briefcase" size={12} color="#9ca3af" />
            </View>
            <View className="flex-1">
              <AppText className="text-xs text-gray-400">Cargo</AppText>
              <AppText className="text-sm text-gray-100">{user.desc_job}</AppText>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export default UserSection;
