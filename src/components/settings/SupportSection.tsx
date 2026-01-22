import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TouchableOpacity, View } from "react-native";
import { AppText } from "../Common/AppText";

interface SupportSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  onPress: () => void;
}

export function SupportSection({
  title = "Suporte",
  subtitle = "Contactar Suporte",
  description = "Resposta por email",
  onPress,
}: SupportSectionProps) {
  return (
    <View className="mb-8">
      <AppText className="text-lg font-bold text-gray-100 mb-4">{title}</AppText>

      <TouchableOpacity
        onPress={onPress}
        className="rounded-2xl p-5 bg-white/5 border border-white/10 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-400/30 items-center justify-center">
            <FontAwesome5 name="envelope" size={14} color="#60a5fa" />
          </View>
          <View>
            <AppText className="text-base font-semibold text-gray-100">{subtitle}</AppText>
            <AppText className="text-xs text-gray-400">{description}</AppText>
          </View>
        </View>
        <FontAwesome5 name="chevron-right" size={14} color="rgba(255,255,255,0.5)" />
      </TouchableOpacity>
    </View>
  );
}
