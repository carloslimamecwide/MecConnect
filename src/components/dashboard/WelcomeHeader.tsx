import { AppText } from "@/src/components/Common/AppText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TouchableOpacity, View } from "react-native";

interface WelcomeHeaderProps {
  firstName: string;
  expiringSoonCount: number;
  onRefresh: () => void;
}

export function WelcomeHeader({ firstName, expiringSoonCount, onRefresh }: WelcomeHeaderProps) {
  return (
    <View className="mb-8">
      <View className="rounded-3xl p-6 border border-white/10 bg-white/5 relative overflow-hidden">
        <View className="flex-row items-center justify-between">
          <View>
            <AppText className="text-xs text-gray-400 mb-2">Bem-vindo</AppText>
            <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Olá, {firstName}</AppText>
            <AppText className="text-gray-300 text-sm md:text-base">Painel de administração interno</AppText>
          </View>
          <TouchableOpacity onPress={onRefresh} className="rounded-full p-3 bg-white/10 border border-white/10">
            <FontAwesome5 name="sync-alt" size={16} color="#93c5fd" />
          </TouchableOpacity>
        </View>

        <View className="mt-5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className={`h-2 w-2 rounded-full ${expiringSoonCount > 0 ? "bg-amber-400" : "bg-emerald-400"}`} />
            <AppText className="text-xs text-gray-300">
              {expiringSoonCount > 0
                ? `${expiringSoonCount} item(ns) a expirar em 7 dias`
                : "Nenhuma expiração crítica"}
            </AppText>
          </View>
          <AppText className="text-xs text-gray-400">
            Atualizado {new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
          </AppText>
        </View>
      </View>
    </View>
  );
}
