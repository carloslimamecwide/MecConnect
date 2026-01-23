import { AppText } from "@/src/components/Common/AppText";
import AppTitle from "@/src/components/Common/AppTitle";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { DatePickerSheet } from "@/src/components/Common/DatePickerSheet";
import { Input } from "@/src/components/Common/Input";
import Loading from "@/src/components/Common/Loading";
import { TextArea } from "@/src/components/Common/TextArea";
import { LANGUAGES } from "@/src/constants/forms";
import { useToast } from "@/src/contexts/ToastContext";
import type { Language } from "@/src/services/eventsService";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import { useAuth } from "../../../src/contexts/AuthContext";
import { RewardForm, rewardService } from "../../../src/services/rewardService";
// const LANGUAGES = ["PT", "EN", "ES"] as const;
// type Language = (typeof LANGUAGES)[number];

export default function RewardsScreen() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const datePickerRef = useRef<BottomSheet>(null);
  const [rewards, setRewards] = useState<RewardForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [rewardToDrawId, setRewardToDrawId] = useState<string | null>(null);
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);

  // Form state
  const [titles, setTitles] = useState<Record<Language, string>>({ PT: "", EN: "", ES: "" });
  const [descriptions, setDescriptions] = useState<Record<Language, string>>({ PT: "", EN: "", ES: "" });
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [numberOfWinnersDraw, setNumberOfWinnersDraw] = useState(1);
  const [activeLang, setActiveLang] = useState<Language>("PT");

  useEffect(() => {
    loadRewards();
  }, []);

  async function loadRewards() {
    try {
      setIsLoading(true);
      const data = await rewardService.getActiveRewards("PT");
      setRewards(data);
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao carregar rewards", type: "error", position: "top" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateReward() {
    if (!titles.PT || !titles.EN || !titles.ES) {
      showToast({ message: "Preencha os títulos em todos os idiomas", type: "error", position: "top" });
      return;
    }

    if (!descriptions.PT || !descriptions.EN || !descriptions.ES) {
      showToast({ message: "Preencha as descrições em todos os idiomas", type: "error", position: "top" });
      return;
    }

    if (!numberOfWinners || numberOfWinners < 1) {
      showToast({ message: "Informe o número de vencedores (mínimo 1)", type: "error", position: "top" });
      return;
    }

    try {
      setIsCreating(true);

      // console.log("Criando reward com dados:", { titles, descriptions, expirationDate, numberOfWinners });
      await rewardService.createReward({
        rewardForm: {
          title: { ...titles },
          description: { ...descriptions },
        },
        dateExpiration: expirationDate.toISOString().split("T")[0],
        numberOfWinners,
      });

      showToast({ message: "Reward criado com sucesso", type: "success", position: "top" });
      setShowCreateForm(false);
      setTitles({ PT: "", EN: "", ES: "" });
      setDescriptions({ PT: "", EN: "", ES: "" });
      setExpirationDate(new Date());
      setNumberOfWinners(1);
      loadRewards();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao criar reward", type: "error", position: "top" });
    } finally {
      setIsCreating(false);
    }
  }

  function handleDeleteClick(rewardId: string) {
    setRewardToDelete(rewardId);
    setShowDeleteModal(true);
  }
  function handleDrawClick(rewardId: string, numberOfWinners: number) {
    setRewardToDrawId(rewardId);
    setNumberOfWinnersDraw(numberOfWinners);
    setShowDrawModal(true);
  }

  async function handleConfirmDelete() {
    if (!rewardToDelete) return;

    try {
      setIsDeleting(true);
      await rewardService.deleteReward(rewardToDelete);
      showToast({ message: "Reward eliminado com sucesso", type: "success", position: "top" });
      setShowDeleteModal(false);
      setRewardToDelete(null);
      loadRewards();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao eliminar reward", type: "error", position: "top" });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }

  // Função para sortear vencedores (placeholder)
  async function handleDrawWinners() {
    try {
      setIsDrawing(true);
      await rewardService.drawWinners(rewardToDrawId || "", numberOfWinnersDraw);
      showToast({ message: "Sorteio realizado com sucesso!", type: "success", position: "top" });
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao realizar sorteio", type: "error", position: "top" });
    } finally {
      setIsDrawing(false);
      setShowDrawModal(false);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout title="Rewards">
        <PageWrapper>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-8">
              <View className="flex-col md:flex-row items-start md:items-center justify-between">
                <AppTitle title="Rewards" iconName="gift" />
                <TouchableOpacity
                  onPress={() => setShowCreateForm(!showCreateForm)}
                  className="rounded-lg px-4 py-2 flex-row items-center gap-2 mt-3 md:mt-0"
                  style={{ backgroundColor: showCreateForm ? "#ef4444" : "#0066CC" }}
                >
                  <FontAwesome5 name={showCreateForm ? "times" : "plus"} size={14} color="#fff" />
                  <AppText className="text-white font-semibold text-sm">
                    {showCreateForm ? "Cancelar" : "Criar Reward"}
                  </AppText>
                </TouchableOpacity>
              </View>
              <View className="mt-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className={`h-2 w-2 rounded-full ${rewards.length ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <AppText className="text-xs text-gray-300">
                    {rewards.length ? `${rewards.length} reward(s) ativo(s)` : "Sem rewards ativos"}
                  </AppText>
                </View>
                <AppText className="text-xs text-gray-400">Gestão rápida</AppText>
              </View>
            </View>

            {/* Create Form */}
            {showCreateForm && (
              <View className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
                <AppText className="text-lg font-bold text-gray-100 mb-4">Novo Reward</AppText>

                <View className="mb-4">
                  <AppText className="text-sm font-semibold text-gray-300 mb-2">Idioma de edição</AppText>
                  <View className="flex-row gap-2">
                    {LANGUAGES.map((lang) => {
                      const isActive = lang === activeLang;
                      return (
                        <TouchableOpacity
                          key={lang}
                          onPress={() => setActiveLang(lang)}
                          className={`rounded-full px-4 py-2 border ${
                            isActive ? "bg-blue-600/20 border-blue-400/40" : "bg-white/5 border-white/10"
                          }`}
                        >
                          <AppText className={`text-xs font-semibold ${isActive ? "text-blue-200" : "text-gray-300"}`}>
                            {lang}
                          </AppText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <AppText className="text-xs text-gray-400 mt-2">
                    Preencha todos os idiomas usando o seletor acima.
                  </AppText>
                </View>

                <View className="mb-4">
                  <Input
                    label={`Título (${activeLang})`}
                    value={titles[activeLang]}
                    onChangeText={(text) => setTitles((prev) => ({ ...prev, [activeLang]: text }))}
                    placeholder={`Digite o título em ${activeLang}`}
                    className="mb-2"
                  />
                  <TextArea
                    label={`Descrição (${activeLang})`}
                    value={descriptions[activeLang]}
                    onChangeText={(text) => setDescriptions((prev) => ({ ...prev, [activeLang]: text }))}
                    placeholder={`Digite a descrição em ${activeLang}`}
                    rows={3}
                  />
                </View>
                <View className="mb-4">
                  <AppText className="text-sm font-semibold text-gray-300 mb-2">Número de Vencedores</AppText>
                  <Input
                    label=""
                    value={String(numberOfWinners)}
                    onChangeText={(text) => setNumberOfWinners(Number(text.replace(/\D/g, "")))}
                    placeholder="Informe o número de vencedores"
                    keyboardType="numeric"
                    className="mb-2"
                  />
                </View>
                <View className="mb-4">
                  <AppText className="text-sm font-semibold text-gray-300 mb-2">Data de Expiração</AppText>
                  <TouchableOpacity
                    onPress={() => datePickerRef.current?.expand()}
                    className="rounded-lg p-4 bg-white/5 border border-white/10 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="rounded-full p-2 bg-blue-500/20">
                        <FontAwesome5 name="calendar-alt" size={18} color="#3b82f6" />
                      </View>
                      <View>
                        <AppText className="text-xs text-gray-400 mb-0.5">Data selecionada</AppText>
                        <AppText className="text-white font-semibold text-base">
                          {expirationDate.toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </AppText>
                      </View>
                    </View>
                    <FontAwesome5 name="chevron-right" size={14} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
                </View>
                <Button
                  title="Criar Reward"
                  variant="success"
                  isLoading={isCreating}
                  disabled={isCreating}
                  onPress={handleCreateReward}
                />
              </View>
            )}

            {/* Rewards List */}
            <View className="mb-4">
              <AppText className="text-lg font-bold text-gray-100 mb-3">Rewards Disponíveis</AppText>
              {isLoading ? (
                <Loading message="A carregar Rewards..." size="large" />
              ) : rewards.length === 0 ? (
                <View className="rounded-xl p-6 bg-white/5 border border-white/10 items-center">
                  <FontAwesome5 name="gift" size={32} color="rgba(255,255,255,0.3)" />
                  <AppText className="text-gray-400 mt-3">Nenhum reward disponível</AppText>
                </View>
              ) : (
                <View className="gap-3">
                  {rewards.map((reward) => {
                    const expired = new Date(reward.dateExpiration) < new Date();
                    return (
                      <View key={reward.id} className="rounded-xl p-5 bg-white/5 border border-white/10">
                        <View className="flex-row items-start justify-between mb-2">
                          <View className="flex-1">
                            <AppText className="text-base font-bold text-gray-100 mb-1">{reward.title}</AppText>
                            <AppText className="text-sm text-gray-300">{reward.description}</AppText>
                          </View>
                          <View className="flex-row items-center gap-3">
                            <FontAwesome5 name="gift" size={20} color="#10b981" />
                            <TouchableOpacity onPress={() => handleDeleteClick(reward.id)}>
                              <FontAwesome5 name="trash" size={18} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View className="flex-row items-center gap-4 mt-3">
                          <View className="flex-row items-center gap-1">
                            <FontAwesome5 name="calendar" size={12} color="rgba(255,255,255,0.5)" />
                            <AppText className="text-xs text-gray-400">
                              Expira: {new Date(reward.dateExpiration).toLocaleDateString("pt-PT")}
                            </AppText>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <FontAwesome5 name="language" size={12} color="rgba(255,255,255,0.5)" />
                            <AppText className="text-xs text-gray-400">{reward.language}</AppText>
                          </View>
                        </View>
                        {expired && (
                          <Button
                            title="Sortear Vencedores"
                            variant="primary"
                            icon="trophy"
                            onPress={() => handleDrawClick(reward.id, reward.numberOfWinners)}
                            className="mt-4"
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>
        </PageWrapper>

        <ConfirmModal
          visible={showDeleteModal}
          title="Eliminar Reward"
          message="Tem a certeza que deseja eliminar este reward? Esta ação não pode ser revertida."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setRewardToDelete(null);
          }}
          isLoading={isDeleting}
        />
        <ConfirmModal
          visible={showDrawModal}
          title="Realizar Sorteio"
          message="Tem a certeza que deseja realizar o sorteio deste reward? Esta ação não pode ser revertida."
          confirmText="Sortear"
          cancelText="Cancelar"
          onConfirm={handleDrawWinners}
          onCancel={() => {
            setShowDrawModal(false);
          }}
          isLoading={isDrawing}
        />

        <DatePickerSheet
          ref={datePickerRef}
          value={expirationDate}
          onChange={setExpirationDate}
          minimumDate={new Date()}
        />
      </AppLayout>
    </GestureHandlerRootView>
  );
}
