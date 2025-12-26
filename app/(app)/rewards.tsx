import { AppText } from "@/src/components/Common/AppText";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { DatePickerSheet } from "@/src/components/Common/DatePickerSheet";
import { useToast } from "@/src/contexts/ToastContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppLayout } from "../../src/components/layout/AppLayout";
import { PageWrapper } from "../../src/components/layout/PageWrapper";
import { useAuth } from "../../src/contexts/AuthContext";
import { RewardForm, rewardService } from "../../src/services/rewardService";

const LANGUAGES = ["PT", "EN", "ES"];

export default function RewardsScreen() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const datePickerRef = useRef<BottomSheet>(null);
  const [rewards, setRewards] = useState<RewardForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);

  // Form state
  const [titles, setTitles] = useState({ PT: "", EN: "", ES: "" });
  const [descriptions, setDescriptions] = useState({ PT: "", EN: "", ES: "" });
  const [expirationDate, setExpirationDate] = useState(new Date());

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

    try {
      setIsCreating(true);
      await rewardService.createReward({
        translations: [
          { language: "PT", title: titles.PT, description: descriptions.PT },
          { language: "EN", title: titles.EN, description: descriptions.EN },
          { language: "ES", title: titles.ES, description: descriptions.ES },
        ],
        dateExpiration: expirationDate.toISOString().split("T")[0],
      });

      showToast({ message: "Reward criado com sucesso", type: "success", position: "top" });
      setShowCreateForm(false);
      setTitles({ PT: "", EN: "", ES: "" });
      setDescriptions({ PT: "", EN: "", ES: "" });
      setExpirationDate(new Date());
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout title="Rewards">
        <PageWrapper>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Rewards</AppText>
                <AppText className="text-gray-300 text-sm md:text-base">Sistema de recompensas e benefícios</AppText>
              </View>
              <TouchableOpacity
                onPress={() => setShowCreateForm(!showCreateForm)}
                className="rounded-lg px-4 py-2 flex-row items-center gap-2"
                style={{ backgroundColor: showCreateForm ? "#ef4444" : "#0066CC" }}
              >
                <FontAwesome5 name={showCreateForm ? "times" : "plus"} size={14} color="#fff" />
                <AppText className="text-white font-semibold text-sm">
                  {showCreateForm ? "Cancelar" : "Criar Reward"}
                </AppText>
              </TouchableOpacity>
            </View>

            {/* Create Form */}
            {showCreateForm && (
              <View className="mb-6 rounded-xl p-5 bg-white/10 border border-white/10">
                <AppText className="text-lg font-bold text-gray-100 mb-4">Novo Reward</AppText>

                {LANGUAGES.map((lang) => (
                  <View key={lang} className="mb-4">
                    <AppText className="text-sm font-semibold text-gray-300 mb-2">Título ({lang})</AppText>
                    <TextInput
                      value={titles[lang as keyof typeof titles]}
                      onChangeText={(text) => setTitles((prev) => ({ ...prev, [lang]: text }))}
                      placeholder={`Digite o título em ${lang}`}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      className="rounded-lg p-3 text-white bg-white/5 border border-white/10 mb-2"
                      style={{ outline: "none" } as any}
                    />
                    <AppText className="text-sm font-semibold text-gray-300 mb-2">Descrição ({lang})</AppText>
                    <TextInput
                      value={descriptions[lang as keyof typeof descriptions]}
                      onChangeText={(text) => setDescriptions((prev) => ({ ...prev, [lang]: text }))}
                      placeholder={`Digite a descrição em ${lang}`}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      multiline
                      numberOfLines={3}
                      className="rounded-lg p-3 text-white bg-white/5 border border-white/10"
                      style={{ outline: "none" } as any}
                    />
                  </View>
                ))}

                <View className="mb-4">
                  <AppText className="text-sm font-semibold text-gray-300 mb-2">Data de Expiração</AppText>
                  <TouchableOpacity
                    onPress={() => datePickerRef.current?.expand()}
                    className="rounded-lg p-4 bg-white/10 border-2 border-white/20 flex-row items-center justify-between"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
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
                  icon="check"
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
                <View className="py-8 items-center">
                  <ActivityIndicator size="large" color="#0066CC" />
                </View>
              ) : rewards.length === 0 ? (
                <View className="rounded-xl p-6 bg-white/5 border border-white/10 items-center">
                  <FontAwesome5 name="gift" size={32} color="rgba(255,255,255,0.3)" />
                  <AppText className="text-gray-400 mt-3">Nenhum reward disponível</AppText>
                </View>
              ) : (
                <View className="gap-3">
                  {rewards.map((reward) => (
                    <View key={reward.id} className="rounded-xl p-5 bg-white/10 border border-white/10">
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
                    </View>
                  ))}
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
