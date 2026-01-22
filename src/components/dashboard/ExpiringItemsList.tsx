import { AppText } from "@/src/components/Common/AppText";
import { ExpiringItem } from "@/src/types/dashboard";
import { formatCountdown, formatShortDate } from "@/src/utils/dateHelpers";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View } from "react-native";

interface ExpiringItemsListProps {
  items: ExpiringItem[];
}

export function ExpiringItemsList({ items }: ExpiringItemsListProps) {
  return (
    <View className="gap-6 md:flex-row md:items-start">
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-3">
          <AppText className="text-lg font-bold text-gray-100">Próximas expirações</AppText>
          <AppText className="text-xs text-gray-400">{items.length} itens</AppText>
        </View>
        <View className="rounded-2xl border border-white/10 bg-white/5 p-4">
          {items.length === 0 ? (
            <AppText className="text-sm text-gray-400">Sem itens com expiração próxima.</AppText>
          ) : (
            items.map((item) => (
              <View key={item.id} className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                    <FontAwesome5 name={item.icon} size={14} color="#d1d5db" />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-sm text-gray-100" numberOfLines={1}>
                      {item.title}
                    </AppText>
                    <AppText className={`text-xs ${item.accent}`}>
                      {item.category} • {formatShortDate(item.dateExpiration)}
                    </AppText>
                  </View>
                </View>
                <AppText className="text-xs text-gray-400">
                  {item.parsedDate ? formatCountdown(item.parsedDate) : "--"}
                </AppText>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
}
