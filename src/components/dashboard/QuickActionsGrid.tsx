import { AppText } from "@/src/components/Common/AppText";
import { QuickAction } from "@/src/types/dashboard";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { Platform, TouchableOpacity, View } from "react-native";

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  const router = useRouter();

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <AppText className="text-lg font-bold text-gray-100">Ações rápidas</AppText>
        <AppText className="text-xs text-gray-400">Atalhos</AppText>
      </View>
      <View className="gap-3 md:flex-row md:flex-wrap">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.label}
            onPress={() => router.push(action.route as any)}
            className="rounded-2xl p-4 border border-white/10 bg-white/5 flex-row items-center justify-between"
            style={Platform.OS === "web" ? { flexGrow: 1, flexBasis: 260, minWidth: 240 } : undefined}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 items-center justify-center">
                <FontAwesome5 name={action.icon} size={16} color="#60a5fa" />
              </View>
              <View>
                <AppText className="text-sm font-semibold text-gray-100">{action.label}</AppText>
                <AppText className="text-xs text-gray-400">{action.description}</AppText>
              </View>
            </View>
            <FontAwesome5 name="chevron-right" size={12} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
