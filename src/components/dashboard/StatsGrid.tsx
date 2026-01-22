import { View } from "react-native";
import { StatCard } from "./StatCard";

interface Stat {
  label: string;
  value: number;
  icon: string;
  tone: string;
  text: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <View className="gap-4 md:flex-row md:flex-wrap mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          tone={stat.tone}
          text={stat.text}
        />
      ))}
    </View>
  );
}
