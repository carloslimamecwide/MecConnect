import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import type { EventForm } from "@/src/services/eventsService";
import { eventsService } from "@/src/services/eventsService";
import type { RewardForm } from "@/src/services/rewardService";
import { rewardService } from "@/src/services/rewardService";
import { DAY_MS, parseDate } from "@/src/utils/dateHelpers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UseDashBoardReturn } from "../types/dashboard";

function useDashBoard(): UseDashBoardReturn {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<EventForm[]>([]);
  const [forms, setForms] = useState<EventForm[]>([]);
  const [rewards, setRewards] = useState<RewardForm[]>([]);

  const cv = user?.cv ?? "";
  const firstName = user?.nome?.trim().split(" ")[0] || "Mecwider";

  const loadDashboard = useCallback(async () => {
    if (!cv) return;
    try {
      setIsLoading(true);
      const [eventsData, rewardsData] = await Promise.all([
        eventsService.getActiveEvents("PT", cv),
        rewardService.getActiveRewards("PT"),
      ]);
      setEvents(eventsData.filter((item) => item.participation));
      setForms(eventsData.filter((item) => !item.participation));
      setRewards(rewardsData);
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao carregar dashboard", type: "error", position: "top" });
    } finally {
      setIsLoading(false);
    }
  }, [cv, showToast]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const expiringItems = useMemo(() => {
    const items = [
      ...events.map((event) => ({
        id: `event-${event.id}`,
        title: event.title,
        dateExpiration: event.dateExpiration,
        category: "Evento",
        icon: "calendar-alt",
        accent: "text-blue-200",
      })),
      ...forms.map((form) => ({
        id: `form-${form.id}`,
        title: form.title,
        dateExpiration: form.dateExpiration,
        category: "Formulário",
        icon: "file-alt",
        accent: "text-amber-200",
      })),
      ...rewards.map((reward) => ({
        id: `reward-${reward.id}`,
        title: reward.title,
        dateExpiration: reward.dateExpiration,
        category: "Reward",
        icon: "gift",
        accent: "text-emerald-200",
      })),
    ];

    return items
      .map((item) => ({
        ...item,
        parsedDate: parseDate(item.dateExpiration),
      }))
      .filter((item) => item.parsedDate)
      .sort((a, b) => (a.parsedDate!.getTime() > b.parsedDate!.getTime() ? 1 : -1))
      .slice(0, 5);
  }, [events, forms, rewards]);

  const expiringSoonCount = useMemo(() => {
    const now = Date.now();
    const windowDays = 7;
    const allDates = [
      ...events.map((event) => parseDate(event.dateExpiration)),
      ...forms.map((form) => parseDate(form.dateExpiration)),
      ...rewards.map((reward) => parseDate(reward.dateExpiration)),
    ].filter(Boolean) as Date[];

    return allDates.filter((date) => {
      const diff = Math.ceil((date.getTime() - now) / DAY_MS);
      return diff >= 0 && diff <= windowDays;
    }).length;
  }, [events, forms, rewards]);

  const stats = [
    {
      label: "Formulários ativos",
      value: forms.length,
      icon: "file-alt",
      tone: "bg-amber-500/15 border-amber-400/30",
      text: "text-amber-100",
    },
    {
      label: "Eventos ativos",
      value: events.length,
      icon: "calendar-alt",
      tone: "bg-blue-500/15 border-blue-400/30",
      text: "text-blue-100",
    },
    {
      label: "Rewards ativos",
      value: rewards.length,
      icon: "gift",
      tone: "bg-emerald-500/15 border-emerald-400/30",
      text: "text-emerald-100",
    },
    {
      label: "A expirar (7 dias)",
      value: expiringSoonCount,
      icon: "hourglass-half",
      tone: "bg-rose-500/15 border-rose-400/30",
      text: "text-rose-100",
    },
  ];

  const quickActions = [
    {
      label: "Criar Formulário",
      description: "Novo questionário",
      icon: "file-alt",
      route: "/forms",
    },
    {
      label: "Criar Evento",
      description: "Nova atividade",
      icon: "calendar-alt",
      route: "/events",
    },
    {
      label: "Criar Reward",
      description: "Novo benefício",
      icon: "gift",
      route: "/rewards",
    },
    {
      label: "Enviar Notificação",
      description: "Comunicado rápido",
      icon: "bell",
      route: "/notifications",
    },
  ];

  return {
    quickActions,
    stats,
    isLoading,
    firstName,
    expiringItems,
    expiringSoonCount,
    loadDashboard,
  };
}

export default useDashBoard;
