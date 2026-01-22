import { AppText } from "@/src/components/Common/AppText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View } from "react-native";

interface ApplicationSectionProps {
  appName: string;
  appVersion: string;
  title?: string;
}

export function ApplicationSection({ appName, appVersion, title = "Aplicação" }: ApplicationSectionProps) {
  return (
    <View className="mb-6">
      <AppText className="text-lg font-bold text-gray-100 mb-4">{title}</AppText>

      <View className="rounded-2xl bg-white/5 border border-white/10">
        <View className="p-4 flex-row items-center gap-3">
          <View className="h-9 w-9 rounded-full bg-white/5 border border-white/10 items-center justify-center">
            <FontAwesome5 name="cube" size={12} color="#9ca3af" />
          </View>
          <View className="flex-1">
            <AppText className="text-xs text-gray-400">Nome</AppText>
            <AppText className="text-sm text-gray-100">{appName}</AppText>
          </View>
        </View>
        <View className="border-t border-white/10 p-4 flex-row items-center gap-3">
          <View className="h-9 w-9 rounded-full bg-white/5 border border-white/10 items-center justify-center">
            <FontAwesome5 name="code-branch" size={12} color="#9ca3af" />
          </View>
          <View className="flex-1">
            <AppText className="text-xs text-gray-400">Versão</AppText>
            <AppText className="text-sm text-gray-100">v{appVersion}</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}
