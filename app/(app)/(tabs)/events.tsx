import { AppText } from "@/src/components/Common/AppText";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import Loading from "@/src/components/Common/Loading";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "../../../src/components/Common/Button";
import { DatePickerSheet } from "../../../src/components/Common/DatePickerSheet";
import { Input } from "../../../src/components/Common/Input";
import { TextArea } from "../../../src/components/Common/TextArea";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import type { EventForm, I18nText, Language, QuestionForm } from "../../../src/services/eventsService";
import { eventsService } from "../../../src/services/eventsService";

const LANGUAGES: Language[] = ["PT", "EN", "ES"];
const STEP_LABELS = ["Informações", "Perguntas", "Revisão"];
const YES_NO_OPTIONS: I18nText[] = [
  { PT: "Sim", EN: "Yes", ES: "Sí" },
  { PT: "Não", EN: "No", ES: "No" },
];
const displayValue = (value: string) => (value.trim() ? value : "-");

const emptyI18n = (): I18nText => ({ PT: "", EN: "", ES: "" });
const newQuestion = (): QuestionForm => ({
  text: emptyI18n(),
  options: [emptyI18n()],
  descType: "Dropdown",
});

export default function EventsScreen() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const datePickerRef = useRef<BottomSheet>(null);

  const [events, setEvents] = useState<EventForm[]>([]);
  const [titles, setTitles] = useState<I18nText>(emptyI18n());
  const [descriptions, setDescriptions] = useState<I18nText>(emptyI18n());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [questions, setQuestions] = useState<QuestionForm[]>([newQuestion()]);
  const [activeLang, setActiveLang] = useState<Language>("PT");
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{ id: string; title: string } | null>(null);
  // Multistep form state
  const [step, setStep] = useState(0); // 0: Info, 1: Perguntas, 2: Revisão

  const cv = user?.cv ?? "";

  useEffect(() => {
    if (!cv) return;
    loadEvents();
  }, [cv]);

  async function loadEvents() {
    try {
      setIsLoading(true);
      const data = await eventsService.getActiveEvents("PT", cv);
      setEvents(data.filter((item) => item.participation));
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao carregar eventos", type: "error", position: "top" });
    } finally {
      setIsLoading(false);
    }
  }

  function validateQuestions(): boolean {
    for (const q of questions) {
      if (LANGUAGES.some((l) => !q.text[l].trim())) return false;
      if (!q.options.length) return false;
      for (const opt of q.options) {
        if (LANGUAGES.some((l) => !opt[l].trim())) return false;
      }
    }
    return true;
  }

  function canSubmitEvent(): boolean {
    if (LANGUAGES.some((l) => !titles[l].trim())) {
      showToast({ message: "Preencha os títulos em todos os idiomas", type: "error", position: "top" });
      return false;
    }
    if (LANGUAGES.some((l) => !descriptions[l].trim())) {
      showToast({ message: "Preencha as descrições em todos os idiomas", type: "error", position: "top" });
      return false;
    }
    if (!validateQuestions()) {
      showToast({
        message: "Preencha todas as perguntas e opções em todos os idiomas",
        type: "error",
        position: "top",
      });
      return false;
    }
    return true;
  }

  async function handleCreateEvent() {
    if (!canSubmitEvent()) return;

    try {
      setIsCreating(true);

      // Evita bugs de timezone do toISOString()
      const dateExpiration = expirationDate.toLocaleDateString("en-CA"); // YYYY-MM-DD

      await eventsService.createEvent({
        eventForm: {
          title: { ...titles },
          description: { ...descriptions },
        },
        questions: questions.map((q) => ({
          text: { ...q.text },
          options: q.options.map((o) => ({ ...o })),
          descType: q.descType,
        })),
        dateExpiration,
      });

      showToast({ message: "Evento criado com sucesso", type: "success", position: "top" });

      setShowCreateForm(false);
      setTitles(emptyI18n());
      setDescriptions(emptyI18n());
      setExpirationDate(new Date());
      setQuestions([newQuestion()]);
      loadEvents();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao criar evento", type: "error", position: "top" });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      await eventsService.deleteEvent(eventId);
      showToast({ message: "Evento eliminado com sucesso", type: "success", position: "top" });
      loadEvents();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao eliminar evento", type: "error", position: "top" });
    }
  }

  async function handleConfirmDelete() {
    if (!eventToDelete) return;
    setIsDeleting(true);
    try {
      await handleDeleteEvent(eventToDelete.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  }

  async function handleConfirmCreate() {
    await handleCreateEvent();
    setShowCreateModal(false);
    setStep(0);
  }

  // ===== updates imutáveis =====
  const setQuestionText = (qIdx: number, lang: Language, value: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, text: { ...q.text, [lang]: value } } : q)));
  };

  const setOptionText = (qIdx: number, optIdx: number, lang: Language, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          options: q.options.map((opt, j) => (j === optIdx ? { ...opt, [lang]: value } : opt)),
        };
      })
    );
  };

  const addOption = (qIdx: number) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIdx ? { ...q, options: [...q.options, emptyI18n()] } : q)));
  };

  const removeOption = (qIdx: number, optIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const next = q.options.filter((_, j) => j !== optIdx);
        return { ...q, options: next.length ? next : [emptyI18n()] };
      })
    );
  };

  const addQuestion = () => {
    let nextIdx = 0;
    setQuestions((prev) => {
      nextIdx = prev.length;
      return [...prev, newQuestion()];
    });
    setExpandedQuestionIdx(nextIdx);
  };

  const removeQuestion = (qIdx: number) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== qIdx);
      return next.length ? next : [newQuestion()];
    });
    setExpandedQuestionIdx((prev) => {
      if (prev === null) return 0;
      if (prev === qIdx) return Math.max(0, qIdx - 1);
      if (prev > qIdx) return prev - 1;
      return prev;
    });
  };

  const applyYesNoOptions = (qIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, options: YES_NO_OPTIONS.map((opt) => ({ ...opt })) } : q))
    );
  };

  const toggleQuestion = (qIdx: number) => {
    setExpandedQuestionIdx((prev) => (prev === qIdx ? null : qIdx));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout title="Eventos">
        <PageWrapper>
          <View className="mb-8">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 items-center justify-center">
                  <FontAwesome5 name="calendar-alt" size={18} color="#60a5fa" />
                </View>
                <View>
                  <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Eventos</AppText>
                  <AppText className="text-gray-300 text-sm md:text-base">Gestão de eventos e atividades</AppText>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowCreateForm((v) => !v)}
                className="rounded-lg px-4 py-2 flex-row items-center gap-2"
                style={{ backgroundColor: showCreateForm ? "#ef4444" : "#0066CC" }}
              >
                <FontAwesome5 name={showCreateForm ? "times" : "plus"} size={14} color="#fff" />
                <AppText className="text-white font-semibold text-sm">
                  {showCreateForm ? "Cancelar" : "Criar Evento"}
                </AppText>
              </TouchableOpacity>
            </View>
            <View className="mt-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className={`h-2 w-2 rounded-full ${events.length ? "bg-emerald-400" : "bg-amber-400"}`} />
                <AppText className="text-xs text-gray-300">
                  {events.length ? `${events.length} evento(s) ativo(s)` : "Sem eventos ativos"}
                </AppText>
              </View>
              <AppText className="text-xs text-gray-400">Gestão rápida</AppText>
            </View>
          </View>

          {showCreateForm && (
            <View className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
              <AppText className="text-lg font-bold text-gray-100 mb-4">Novo Evento</AppText>

              <View className="mb-5">
                <View className="flex-row items-center justify-between mb-3">
                  <AppText className="text-xs text-gray-400">
                    Etapa {step + 1} de {STEP_LABELS.length}
                  </AppText>
                  <AppText className="text-xs text-gray-400">{STEP_LABELS[step]}</AppText>
                </View>
                <View className="flex-row gap-2">
                  {STEP_LABELS.map((label, idx) => {
                    const isActive = idx === step;
                    return (
                      <View
                        key={label}
                        className={`flex-1 rounded-full px-3 py-2 border ${
                          isActive ? "bg-blue-600/20 border-blue-400/40" : "bg-white/5 border-white/10"
                        }`}
                      >
                        <AppText className={`text-xs text-center ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                          {idx + 1}. {label}
                        </AppText>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View className="mb-4">
                <AppText className="text-sm font-semibold text-gray-300 mb-2">
                  {step === 2 ? "Idioma da revisão" : "Idioma de edição"}
                </AppText>
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
                  Use o seletor acima para rever todos os idiomas.
                </AppText>
              </View>

              {/* Etapa 1: Informações básicas */}
              {step === 0 && (
                <>
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
                </>
              )}

              {/* Etapa 2: Perguntas e opções */}
              {step === 1 && (
                <>
                  <View className="flex-row items-center justify-between mb-2 mt-4">
                    <AppText className="text-base font-bold text-gray-100">Perguntas do Evento</AppText>
                    <AppText className="text-xs text-gray-400">{questions.length} pergunta(s)</AppText>
                  </View>
                  {questions.map((q, qIdx) => (
                    <View key={qIdx} className="mb-5 rounded-lg p-4 border border-white/10">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1 mr-3">
                          <AppText className="text-gray-100 font-bold">Pergunta {qIdx + 1}</AppText>
                          <AppText className="text-xs text-gray-400" numberOfLines={1}>
                            {q.text[activeLang].trim() || "Sem texto"}
                          </AppText>
                        </View>
                        <View className="flex-row items-center gap-3">
                          <TouchableOpacity onPress={() => removeQuestion(qIdx)}>
                            <AppText className="text-red-400 text-xs">Remover</AppText>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => toggleQuestion(qIdx)}
                            className="rounded-full p-2 bg-white/5 border border-white/10"
                          >
                            <FontAwesome5
                              name={expandedQuestionIdx === qIdx ? "chevron-up" : "chevron-down"}
                              size={12}
                              color="rgba(255,255,255,0.7)"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-3 mt-2">
                        <AppText className="text-xs text-gray-400">{q.options.length} opção(ões)</AppText>
                        <AppText className="text-xs text-gray-400">Idioma: {activeLang}</AppText>
                      </View>

                      {expandedQuestionIdx === qIdx && (
                        <View className="mt-4">
                          <Input
                            label={`Texto da pergunta (${activeLang})`}
                            value={q.text[activeLang]}
                            onChangeText={(text) => setQuestionText(qIdx, activeLang, text)}
                            placeholder={`Texto da pergunta em ${activeLang}`}
                            className="mb-2"
                          />

                          <View className="mt-3 pt-3">
                            <View className="flex-row items-center justify-between mb-3">
                              <AppText className="text-xs text-gray-300">Opções ({q.options.length})</AppText>
                              <View className="flex-row items-center gap-3">
                                <TouchableOpacity onPress={() => applyYesNoOptions(qIdx)}>
                                  <AppText className="text-blue-400 text-xs">Sim/Não</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => addOption(qIdx)}>
                                  <AppText className="text-blue-400 text-xs">Adicionar</AppText>
                                </TouchableOpacity>
                              </View>
                            </View>
                            {q.options.map((opt, optIdx) => (
                              <View key={optIdx} className={`pt-3 ${optIdx === 0 ? "" : "border-t border-white/10"}`}>
                                <View className="flex-row items-center justify-between mb-2">
                                  <AppText className="text-gray-200 font-semibold">Opção {optIdx + 1}</AppText>
                                  <TouchableOpacity onPress={() => removeOption(qIdx, optIdx)}>
                                    <AppText className="text-red-400 text-xs">Remover</AppText>
                                  </TouchableOpacity>
                                </View>
                                <Input
                                  label={`Texto (${activeLang})`}
                                  value={opt[activeLang]}
                                  onChangeText={(text) => setOptionText(qIdx, optIdx, activeLang, text)}
                                  placeholder={`Opção em ${activeLang}`}
                                />
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity onPress={addQuestion} className="mb-4">
                    <AppText className="text-blue-400">Adicionar nova pergunta</AppText>
                  </TouchableOpacity>
                </>
              )}

              {/* Etapa 3: Revisão */}
              {step === 2 && (
                <>
                  <AppText className="text-base font-bold text-gray-100 mb-2 mt-4">Revisão</AppText>
                  <AppText className="text-gray-200 mb-2">Confira os dados antes de criar o evento.</AppText>
                  <View className="rounded-lg p-4 border border-white/10 mb-4">
                    <AppText className="text-sm font-semibold text-gray-200 mb-3">Informações ({activeLang})</AppText>
                    <View className="mb-2">
                      <AppText className="text-xs text-gray-400">Título</AppText>
                      <AppText className="text-gray-100">{displayValue(titles[activeLang])}</AppText>
                    </View>
                    <View className="mb-2">
                      <AppText className="text-xs text-gray-400">Descrição</AppText>
                      <AppText className="text-gray-100">{displayValue(descriptions[activeLang])}</AppText>
                    </View>
                    <View>
                      <AppText className="text-xs text-gray-400">Data de Expiração</AppText>
                      <AppText className="text-gray-100">
                        {expirationDate.toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </AppText>
                    </View>
                  </View>

                  <View className="rounded-lg p-4 border border-white/10">
                    <View className="flex-row items-center justify-between mb-3">
                      <AppText className="text-sm font-semibold text-gray-200">Perguntas ({questions.length})</AppText>
                      <AppText className="text-xs text-gray-400">Idioma: {activeLang}</AppText>
                    </View>
                    {questions.map((q, qIdx) => (
                      <View key={qIdx} className="mb-4">
                        <AppText className="text-gray-200 font-semibold">Pergunta {qIdx + 1}</AppText>
                        <AppText className="text-gray-300 mb-2">{displayValue(q.text[activeLang])}</AppText>
                        <View className="ml-3">
                          {q.options.map((opt, optIdx) => (
                            <AppText key={optIdx} className="text-gray-400">
                              {optIdx + 1}. {displayValue(opt[activeLang])}
                            </AppText>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Navegação entre etapas */}
              <View className="flex-row justify-between mt-6 gap-2">
                {step > 0 && (
                  <Button title="Voltar" variant="secondary" onPress={() => setStep((s) => s - 1)} width={"48%"} />
                )}
                {step < 2 && (
                  <Button
                    title="Avançar"
                    variant="primary"
                    width={step > 0 ? "48%" : "100%"}
                    onPress={() => {
                      // Validação por etapa
                      if (step === 0) {
                        if (LANGUAGES.some((l) => !titles[l].trim())) {
                          showToast({
                            message: "Preencha os títulos em todos os idiomas",
                            type: "error",
                            position: "top",
                          });
                          return;
                        }
                        if (LANGUAGES.some((l) => !descriptions[l].trim())) {
                          showToast({
                            message: "Preencha as descrições em todos os idiomas",
                            type: "error",
                            position: "top",
                          });
                          return;
                        }
                      }
                      if (step === 1) {
                        if (!validateQuestions()) {
                          showToast({
                            message: "Preencha todas as perguntas e opções em todos os idiomas",
                            type: "error",
                            position: "top",
                          });
                          return;
                        }
                      }
                      setStep((s) => s + 1);
                    }}
                  />
                )}
                {step === 2 && (
                  <Button
                    title="Criar Evento"
                    variant="success"
                    width={"48%"}
                    isLoading={isCreating}
                    disabled={isCreating}
                    onPress={() => {
                      if (!canSubmitEvent()) return;
                      setShowCreateModal(true);
                    }}
                  />
                )}
              </View>
            </View>
          )}

          <View className="mb-4">
            <AppText className="text-lg font-bold text-gray-100 mb-3">Eventos Disponíveis</AppText>

            {isLoading ? (
              <Loading message="A carregar Eventos..." size="large" />
            ) : events.length === 0 ? (
              <View className="rounded-xl p-6 bg-white/5 border border-white/10 items-center">
                <FontAwesome5 name="calendar" size={32} color="rgba(255,255,255,0.3)" />
                <AppText className="text-gray-400 mt-3">Nenhum evento disponível</AppText>
              </View>
            ) : (
              <View className="gap-3">
                {events.map((event) => (
                  <View key={event.id} className="rounded-xl p-5 bg-white/5 border border-white/10">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <AppText className="text-base font-bold text-gray-100 mb-1">{event.title}</AppText>
                        <AppText className="text-sm text-gray-300">{event.description}</AppText>
                      </View>

                      <View className="flex-row items-center gap-3">
                        <FontAwesome5 name="gift" size={20} color="#10b981" />
                        <TouchableOpacity
                          onPress={() => {
                            setEventToDelete({ id: event.id, title: event.title });
                            setShowDeleteModal(true);
                          }}
                        >
                          <FontAwesome5 name="trash" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-4 mt-3">
                      <View className="flex-row items-center gap-1">
                        <FontAwesome5 name="calendar" size={12} color="rgba(255,255,255,0.5)" />
                        <AppText className="text-xs text-gray-400">
                          Expira: {new Date(event.dateExpiration).toLocaleDateString("pt-PT")}
                        </AppText>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <FontAwesome5 name="language" size={12} color="rgba(255,255,255,0.5)" />
                        <AppText className="text-xs text-gray-400">{event.language}</AppText>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </PageWrapper>

        <DatePickerSheet
          ref={datePickerRef}
          value={expirationDate}
          onChange={setExpirationDate}
          minimumDate={new Date()}
        />

        <ConfirmModal
          visible={showCreateModal}
          title="Confirmar criação"
          message="Tem a certeza que deseja criar este evento?"
          confirmText="Criar"
          cancelText="Cancelar"
          onConfirm={handleConfirmCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isCreating}
        />
        <ConfirmModal
          visible={showDeleteModal}
          title="Eliminar evento"
          message={`Tem a certeza que deseja eliminar o evento${eventToDelete?.title ? ` "${eventToDelete.title}"` : ""}? Esta ação não pode ser revertida.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setEventToDelete(null);
          }}
          isLoading={isDeleting}
          isDangerous
        />
      </AppLayout>
    </GestureHandlerRootView>
  );
}
