import type { EventForm } from "@/src/services/eventsService";
import type { RewardForm } from "@/src/services/rewardService";

export interface ExpiringItem {
  id: string;
  title: string;
  dateExpiration: string;
  category: string;
  icon: string;
  accent: string;
  parsedDate?: Date | null;
}

export interface StatCard {
  label: string;
  value: number;
  icon: string;
  tone: string;
  text: string;
}

export interface QuickAction {
  label: string;
  description: string;
  icon: string;
  route: string;
}

export interface UseDashBoardReturn {
  quickActions: QuickAction[];
  stats: StatCard[];
  isLoading: boolean;
  firstName: string;
  expiringItems: ExpiringItem[];
  expiringSoonCount: number;
  loadDashboard: () => Promise<void>;
}

export interface DashBoardData {
  events: EventForm[];
  forms: EventForm[];
  rewards: RewardForm[];
}
