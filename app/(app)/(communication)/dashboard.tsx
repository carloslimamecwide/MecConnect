import { AppText } from "@/src/components/Common/AppText";
import Loading from "@/src/components/Common/Loading";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import type { EventForm } from "../../../src/services/eventsService";
import { eventsService } from "../../../src/services/eventsService";
import type { RewardForm } from "../../../src/services/rewardService";
import { rewardService } from "../../../src/services/rewardService";

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });

const formatCountdown = (date: Date) => {
  const diff = Math.ceil((date.getTime() - Date.now()) / DAY_MS);
  if (diff < 0) return "Expirado";
  if (diff === 0) return "Expira hoje";
  if (diff === 1) return "Expira amanhã";
  return `Expira em ${diff} dias`;
};

export default function DashboardScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

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

  return (
    <AppLayout title="Dashboard">
      <PageWrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-8">
            <View className="rounded-3xl p-6 border border-white/10 bg-white/5 relative overflow-hidden">
              <View className="absolute -top-10 -right-12 h-32 w-32 rounded-full bg-blue-500/15" />
              <View className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-emerald-500/10" />
              <View className="flex-row items-center justify-between">
                <View>
                  <AppText className="text-xs text-gray-400 mb-2">Bem-vindo</AppText>
                  <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Olá, {firstName}</AppText>
                  <AppText className="text-gray-300 text-sm md:text-base">Painel de administração interno</AppText>
                </View>
                <TouchableOpacity
                  onPress={loadDashboard}
                  className="rounded-full p-3 bg-white/10 border border-white/10"
                >
                  <FontAwesome5 name="sync-alt" size={16} color="#93c5fd" />
                </TouchableOpacity>
              </View>

              <View className="mt-5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View
                    className={`h-2 w-2 rounded-full ${expiringSoonCount > 0 ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
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

          {isLoading ? (
            <Loading message="A carregar dashboard..." size="large" />
          ) : (
            <>
              <View className="gap-4 md:flex-row md:flex-wrap mb-8">
                {stats.map((stat) => (
                  <View
                    key={stat.label}
                    className={`rounded-2xl p-5 border ${stat.tone} flex-row items-center justify-between`}
                    style={Platform.OS === "web" ? { flexGrow: 1, flexBasis: 240, minWidth: 220 } : undefined}
                  >
                    <View>
                      <AppText className="text-xs text-gray-400 mb-1">{stat.label}</AppText>
                      <AppText className={`text-3xl font-bold ${stat.text}`}>{stat.value}</AppText>
                    </View>
                    <FontAwesome5 name={stat.icon} size={24} color="rgba(255,255,255,0.6)" />
                  </View>
                ))}
              </View>

              <View className="mb-8">
                <View className="flex-row items-center justify-between mb-4">
                  <AppText className="text-lg font-bold text-gray-100">Ações rápidas</AppText>
                  <AppText className="text-xs text-gray-400">Atalhos</AppText>
                </View>
                <View className="gap-3 md:flex-row md:flex-wrap">
                  {quickActions.map((action) => (
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

              <View className="gap-6 md:flex-row md:items-start">
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-3">
                    <AppText className="text-lg font-bold text-gray-100">Próximas expirações</AppText>
                    <AppText className="text-xs text-gray-400">{expiringItems.length} itens</AppText>
                  </View>
                  <View className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {expiringItems.length === 0 ? (
                      <AppText className="text-sm text-gray-400">Sem itens com expiração próxima.</AppText>
                    ) : (
                      expiringItems.map((item) => (
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
            </>
          )}
        </ScrollView>
      </PageWrapper>
    </AppLayout>
  );
}
