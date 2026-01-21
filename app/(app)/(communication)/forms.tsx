import { AppText } from "@/src/components/Common/AppText";
import { Button } from "@/src/components/Common/Button";
import { ConfirmModal } from "@/src/components/Common/ConfirmModal";
import { DatePickerSheet } from "@/src/components/Common/DatePickerSheet";
import { Input } from "@/src/components/Common/Input";
import Loading from "@/src/components/Common/Loading";
import { TextArea } from "@/src/components/Common/TextArea";
import { useToast } from "@/src/contexts/ToastContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet from "@gorhom/bottom-sheet";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppLayout } from "../../../src/components/layout/AppLayout";
import { PageWrapper } from "../../../src/components/layout/PageWrapper";
import { useAuth } from "../../../src/contexts/AuthContext";
import type { EventForm, I18nText, Language, QuestionDescType } from "../../../src/services/eventsService";
import { eventsService } from "../../../src/services/eventsService";
import { excelService, type ExcelFormData } from "../../../src/services/excelService";

const LANGUAGES: Language[] = ["PT", "EN", "ES"];
const STEP_LABELS = ["Informações", "Grupos", "Revisão"];
const DESC_TYPES: QuestionDescType[] = ["TextBox", "Dropdown", "Rating"];

const emptyI18n = (): I18nText => ({ PT: "", EN: "", ES: "" });
const displayValue = (value: string) => (value.trim() ? value : "-");

type FormOption = {
  description: I18nText;
};

type FormQuestion = {
  text: I18nText;
  descType: QuestionDescType;
  required: boolean;
  options: FormOption[];
};

type FormGroup = {
  group: I18nText;
  questions: FormQuestion[];
};

const newOption = (): FormOption => ({ description: emptyI18n() });
const newQuestion = (): FormQuestion => ({ text: emptyI18n(), descType: "TextBox", required: true, options: [] });
const newGroup = (): FormGroup => ({ group: emptyI18n(), questions: [newQuestion()] });

const formatDescType = (value: QuestionDescType) => {
  if (value === "TextBox") return "Texto";
  if (value === "Rating") return "Rating";
  return "Dropdown";
};

const trimI18n = (value: I18nText): I18nText => ({
  PT: value.PT.trim(),
  EN: value.EN.trim(),
  ES: value.ES.trim(),
});

export default function FormsScreen() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const datePickerRef = useRef<BottomSheet>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formToDelete, setFormToDelete] = useState<{ id: string; title: string } | null>(null);
  const [forms, setForms] = useState<EventForm[]>([]);
  const [titles, setTitles] = useState<I18nText>(emptyI18n());
  const [descriptions, setDescriptions] = useState<I18nText>(emptyI18n());
  const [activeLang, setActiveLang] = useState<Language>("PT");
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [groups, setGroups] = useState<FormGroup[]>([newGroup()]);
  const [step, setStep] = useState(0);

  const cv = user?.cv ?? "";

  useEffect(() => {
    if (!cv) return;
    loadForms();
  }, [cv]);

  async function handleDownloadTemplate() {
    try {
      excelService.downloadTemplate();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao descarregar template", type: "error", position: "top" });
    }
  }

  async function handleImportExcel() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const excelFile = new File([blob], file.name, { type: file.mimeType });

      const excelData: ExcelFormData = await excelService.parseExcel(excelFile);

      // Populate form fields from Excel
      setTitles(excelData.title);
      setDescriptions(excelData.description);

      // Parse and set expiration date
      const [year, month, day] = excelData.dateExpiration.split("-");
      setExpirationDate(new Date(`${year}-${month}-${day}`));

      // Transform Excel groups to component groups
      const importedGroups = excelData.groups.map((group) => ({
        group: group.groupName,
        questions: group.questions,
      }));

      setGroups(importedGroups);
      setShowCreateForm(true);
      setStep(0);
      showToast({
        message: "Formulário importado com sucesso! Revise e customize conforme necessário.",
        type: "success",
        position: "top",
      });
    } catch (error: any) {
      showToast({
        message: error.message || "Erro ao importar ficheiro Excel",
        type: "error",
        position: "top",
      });
    }
  }

  async function loadForms() {
    try {
      setIsLoading(true);
      const data = await eventsService.getActiveEvents("PT", cv);
      setForms(data.filter((item) => !item.participation));
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao carregar formulários", type: "error", position: "top" });
    } finally {
      setIsLoading(false);
    }
  }

  const getGroupCount = (form: EventForm) => form.questionGroups?.length ?? 0;
  const getQuestionCount = (form: EventForm) =>
    form.questionGroups?.reduce((total, group) => total + group.questions.length, 0) ?? 0;
  const getDescTypes = (form: EventForm) => {
    const types = new Set<QuestionDescType>();
    form.questionGroups?.forEach((group) => {
      group.questions.forEach((question) => types.add(question.descType));
    });
    return Array.from(types);
  };

  const setGroupName = (groupIdx: number, value: string) => {
    setGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIdx ? { ...group, group: { ...group.group, [activeLang]: value } } : group,
      ),
    );
  };

  const addGroup = () => setGroups((prev) => [...prev, newGroup()]);

  const removeGroup = (groupIdx: number) => {
    setGroups((prev) => {
      const next = prev.filter((_, idx) => idx !== groupIdx);
      return next.length ? next : [newGroup()];
    });
  };

  const setQuestionText = (groupIdx: number, qIdx: number, value: string) => {
    setGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIdx) return group;
        return {
          ...group,
          questions: group.questions.map((question, idx) =>
            idx === qIdx ? { ...question, text: { ...question.text, [activeLang]: value } } : question,
          ),
        };
      }),
    );
  };

  const setQuestionType = (groupIdx: number, qIdx: number, value: QuestionDescType) => {
    setGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIdx) return group;
        return {
          ...group,
          questions: group.questions.map((question, idx) => {
            if (idx !== qIdx) return question;
            const nextOptions =
              value === "Dropdown" ? (question.options.length ? question.options : [newOption()]) : [];
            return {
              ...question,
              descType: value,
              options: nextOptions,
            };
          }),
        };
      }),
    );
  };

  const toggleQuestionRequired = (groupIdx: number, qIdx: number) => {
    setGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIdx) return group;
        return {
          ...group,
          questions: group.questions.map((question, idx) =>
            idx === qIdx ? { ...question, required: !question.required } : question,
          ),
        };
      }),
    );
  };

  const addQuestion = (groupIdx: number) => {
    setGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIdx ? { ...group, questions: [...group.questions, newQuestion()] } : group,
      ),
    );
  };

  const removeQuestion = (groupIdx: number, qIdx: number) => {
    setGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIdx) return group;
        const next = group.questions.filter((_, idx) => idx !== qIdx);
        return { ...group, questions: next.length ? next : [newQuestion()] };
      }),
    );
  };

  const setOptionDescription = (groupIdx: number, qIdx: number, optIdx: number, value: string) => {
    setGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIdx) return group;
        return {
          ...group,
          questions: group.questions.map((question, qIndex) => {
            if (qIndex !== qIdx) return question;
            return {
              ...question,
              options: question.options.map((opt, oIdx) =>
                oIdx === optIdx ? { ...opt, description: { ...opt.description, [activeLang]: value } } : opt,
              ),
            };
          }),
        };
      }),
    );
  };

  const addOption = (groupIdx: number, qIdx: number) => {
    setGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIdx) return group;
        return {
          ...group,
          questions: group.questions.map((question, qIndex) =>
            qIndex === qIdx ? { ...question, options: [...question.options, newOption()] } : question,
          ),
        };
      }),
    );
  };

  const removeOption = (groupIdx: number, qIdx: number, optIdx: number) => {
    setGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIdx) return group;
        return {
          ...group,
          questions: group.questions.map((question, qIndex) => {
            if (qIndex !== qIdx) return question;
            const next = question.options.filter((_, idx) => idx !== optIdx);
            return { ...question, options: next.length ? next : [newOption()] };
          }),
        };
      }),
    );
  };

  function validateGroups(): boolean {
    for (const group of groups) {
      for (const question of group.questions) {
        if (LANGUAGES.some((lang) => !question.text[lang].trim())) return false;
        if (question.descType === "Dropdown") {
          if (!question.options.length) return false;
          for (const opt of question.options) {
            if (LANGUAGES.some((lang) => !opt.description[lang].trim())) return false;
          }
        }
      }
    }
    return true;
  }

  function canSubmitForm(): boolean {
    if (LANGUAGES.some((lang) => !titles[lang].trim())) {
      showToast({ message: "Preencha os títulos em todos os idiomas", type: "error", position: "top" });
      return false;
    }
    if (LANGUAGES.some((lang) => !descriptions[lang].trim())) {
      showToast({ message: "Preencha as descrições em todos os idiomas", type: "error", position: "top" });
      return false;
    }
    if (!validateGroups()) {
      showToast({ message: "Preencha todos os grupos, perguntas e opções", type: "error", position: "top" });
      return false;
    }
    return true;
  }

  const resetForm = () => {
    setShowCreateForm(false);
    setTitles(emptyI18n());
    setDescriptions(emptyI18n());
    setExpirationDate(new Date());
    setGroups([newGroup()]);
    setActiveLang("PT");
    setStep(0);
  };

  async function handleCreateForm() {
    if (!canSubmitForm()) return;

    try {
      setIsCreating(true);
      const dateExpiration = expirationDate.toLocaleDateString("en-CA");

      await eventsService.createForm({
        formForm: {
          title: { ...titles },
          description: { ...descriptions },
        },
        dateExpiration,
        questionGroups: groups.map((group) => ({
          group: trimI18n(group.group),
          questions: group.questions.map((question) => ({
            text: trimI18n(question.text),
            descType: question.descType,
            required: question.required,
            options:
              question.descType === "Dropdown"
                ? question.options.map((opt) => ({
                    description: trimI18n(opt.description),
                  }))
                : [],
          })),
        })),
      });

      showToast({ message: "Formulário criado com sucesso", type: "success", position: "top" });
      resetForm();
      loadForms();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao criar formulário", type: "error", position: "top" });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleConfirmCreate() {
    try {
      excelService.exportFilledForm(titles, descriptions, expirationDate, groups);
      showToast({
        message: "Excel descarregado automaticamente",
        type: "success",
        position: "top",
      });
    } catch (error: any) {
      showToast({
        message: "Aviso: Erro ao descarregar Excel",
        type: "error",
        position: "top",
      });
    }
    await handleCreateForm();
    setShowCreateModal(false);
  }

  async function handleDeleteForm(formId: string) {
    try {
      await eventsService.deleteForm(formId);
      showToast({ message: "Formulário eliminado com sucesso", type: "success", position: "top" });
      loadForms();
    } catch (error: any) {
      showToast({ message: error.message || "Erro ao eliminar formulário", type: "error", position: "top" });
    }
  }

  async function handleConfirmDelete() {
    if (!formToDelete) return;
    setIsDeleting(true);
    try {
      await handleDeleteForm(formToDelete.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setFormToDelete(null);
    }
  }
  const handleStepclick = () => {
    if (step === 0) {
      if (LANGUAGES.some((lang) => !titles[lang].trim())) {
        showToast({
          message: "Preencha os títulos em todos os idiomas",
          type: "error",
          position: "top",
        });
        return;
      }
      if (LANGUAGES.some((lang) => !descriptions[lang].trim())) {
        showToast({
          message: "Preencha as descrições em todos os idiomas",
          type: "error",
          position: "top",
        });
        return;
      }
    }
    if (step === 1) {
      if (!validateGroups()) {
        showToast({
          message: "Preencha todos os grupos, perguntas e opções",
          type: "error",
          position: "top",
        });
        return;
      }
    }
    setStep((s) => s + 1);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout title="Formulários">
        <PageWrapper>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 items-center justify-center">
                    <FontAwesome5 name="clipboard-list" size={18} color="#60a5fa" />
                  </View>
                  <View>
                    <AppText className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Formulários</AppText>
                  </View>
                </View>
              </View>

              <View className="flex-row flex-wrap items-center gap-2 mb-4">
                <TouchableOpacity
                  onPress={handleDownloadTemplate}
                  className="flex-1 min-w-[100px] rounded-lg px-3 py-2.5 flex-row items-center justify-center gap-2 bg-green-600/20 border border-green-500/30"
                >
                  <FontAwesome5 name="download" size={14} color="#34d399" />
                  <AppText className="text-green-400 font-semibold text-sm">Template</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleImportExcel}
                  className="flex-1 min-w-[100px] rounded-lg px-3 py-2.5 flex-row items-center justify-center gap-2 bg-purple-600/20 border border-purple-500/30"
                >
                  <FontAwesome5 name="upload" size={14} color="#a78bfa" />
                  <AppText className="text-purple-400 font-semibold text-sm">Importar</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowCreateForm((v) => !v)}
                  className="flex-1 min-w-[100px] rounded-lg px-3 py-2.5 flex-row items-center justify-center gap-2"
                  style={{ backgroundColor: showCreateForm ? "#ef4444" : "#0066CC" }}
                >
                  <FontAwesome5 name={showCreateForm ? "times" : "plus"} size={14} color="#fff" />
                  <AppText className="text-white font-semibold text-sm">
                    {showCreateForm ? "Cancelar" : "Criar"}
                  </AppText>
                </TouchableOpacity>
              </View>

              <View className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className={`h-2 w-2 rounded-full ${forms.length ? "bg-emerald-400" : "bg-amber-400"}`} />
                  <AppText className="text-xs text-gray-300">
                    {forms.length ? `${forms.length} formulário(s) ativo(s)` : "Sem formulários ativos"}
                  </AppText>
                </View>
                <AppText className="text-xs text-gray-400">Gestão rápida</AppText>
              </View>
            </View>

            {showCreateForm && (
              <View className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
                <AppText className="text-lg font-bold text-gray-100 mb-4">Novo Formulário</AppText>

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
                  <AppText className="text-sm font-semibold text-gray-300 mb-2">Idioma do formulário</AppText>
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
                    Preencha títulos e descrições em todos os idiomas.
                  </AppText>
                </View>

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

                {step === 1 && (
                  <>
                    <View className="flex-row items-center justify-between mb-3">
                      <AppText className="text-base font-bold text-gray-100">Grupos do Formulário</AppText>
                      <AppText className="text-xs text-gray-400">{groups.length} grupo(s)</AppText>
                    </View>
                    {groups.map((group, groupIdx) => (
                      <View key={groupIdx} className="mb-4 rounded-lg p-4 border border-white/10">
                        <View className="flex-row items-center justify-between mb-2">
                          <AppText className="text-gray-100 font-bold">Grupo {groupIdx + 1}</AppText>
                          <TouchableOpacity onPress={() => removeGroup(groupIdx)}>
                            <AppText className="text-red-400 text-xs">Remover grupo</AppText>
                          </TouchableOpacity>
                        </View>
                        <Input
                          label={`Nome do grupo (${activeLang}) (opcional)`}
                          value={group.group[activeLang]}
                          onChangeText={(text) => setGroupName(groupIdx, text)}
                          placeholder="Sem grupo"
                          className="mb-2"
                        />

                        <AppText className="text-xs text-gray-300 mt-2 mb-2">Perguntas</AppText>
                        {group.questions.map((question, qIdx) => (
                          <View key={qIdx} className="rounded-lg p-3 border border-white/10 mb-3">
                            <View className="flex-row items-center justify-between mb-2">
                              <AppText className="text-gray-200 font-semibold">Pergunta {qIdx + 1}</AppText>
                              <TouchableOpacity onPress={() => removeQuestion(groupIdx, qIdx)}>
                                <AppText className="text-red-400 text-xs">Remover</AppText>
                              </TouchableOpacity>
                            </View>
                            <Input
                              label={`Texto da pergunta (${activeLang})`}
                              value={question.text[activeLang]}
                              onChangeText={(text) => setQuestionText(groupIdx, qIdx, text)}
                              placeholder={`Digite a pergunta em ${activeLang}`}
                            />

                            <View className="mt-3">
                              <AppText className="text-xs text-gray-300 mb-2">Tipo de resposta</AppText>
                              <View className="flex-row flex-wrap gap-2">
                                {DESC_TYPES.map((type) => {
                                  const isActive = type === question.descType;
                                  return (
                                    <TouchableOpacity
                                      key={type}
                                      onPress={() => setQuestionType(groupIdx, qIdx, type)}
                                      className={`rounded-full px-3 py-2 border ${
                                        isActive ? "bg-blue-600/20 border-blue-400/40" : "bg-white/5 border-white/10"
                                      }`}
                                    >
                                      <AppText className={`text-xs ${isActive ? "text-blue-200" : "text-gray-300"}`}>
                                        {formatDescType(type)}
                                      </AppText>
                                    </TouchableOpacity>
                                  );
                                })}
                                <TouchableOpacity
                                  onPress={() => toggleQuestionRequired(groupIdx, qIdx)}
                                  className={`rounded-full px-3 py-2 border ${
                                    question.required
                                      ? "bg-emerald-500/20 border-emerald-400/40"
                                      : "bg-white/5 border-white/10"
                                  }`}
                                >
                                  <AppText
                                    className={`text-xs ${question.required ? "text-emerald-200" : "text-gray-300"}`}
                                  >
                                    Obrigatória
                                  </AppText>
                                </TouchableOpacity>
                              </View>
                            </View>

                            {question.descType === "Dropdown" && (
                              <View className="mt-4">
                                <View className="flex-row items-center justify-between mb-2">
                                  <AppText className="text-xs text-gray-300">Opções</AppText>
                                </View>
                                {question.options.map((opt, optIdx) => (
                                  <View key={optIdx} className="mb-3">
                                    <View className="flex-row items-center justify-between mb-2">
                                      <AppText className="text-gray-200 font-semibold">Opção {optIdx + 1}</AppText>
                                      <TouchableOpacity onPress={() => removeOption(groupIdx, qIdx, optIdx)}>
                                        <AppText className="text-red-400 text-xs">Remover</AppText>
                                      </TouchableOpacity>
                                    </View>
                                    <Input
                                      label={`Descrição (${activeLang})`}
                                      value={opt.description[activeLang]}
                                      onChangeText={(text) => setOptionDescription(groupIdx, qIdx, optIdx, text)}
                                      placeholder={`Ex: Excelente (${activeLang})`}
                                    />
                                  </View>
                                ))}
                                <TouchableOpacity onPress={() => addOption(groupIdx, qIdx)} className="mt-1">
                                  <AppText className="text-blue-400 text-xs">Adicionar opção</AppText>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        ))}
                        <TouchableOpacity onPress={() => addQuestion(groupIdx)} className="mt-1">
                          <AppText className="text-blue-400 text-xs">Adicionar pergunta</AppText>
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity onPress={addGroup}>
                      <AppText className="text-blue-400">Adicionar novo grupo</AppText>
                    </TouchableOpacity>
                  </>
                )}

                {step === 2 && (
                  <>
                    <AppText className="text-base font-bold text-gray-100 mb-2 mt-4">Revisão</AppText>
                    <AppText className="text-gray-200 mb-2">Confira os dados antes de criar o formulário.</AppText>

                    <View className="rounded-lg p-4 border border-white/10 mb-4">
                      <AppText className="text-sm font-semibold text-gray-200 mb-3">Informações ({activeLang})</AppText>
                      <View className="mb-3">
                        <AppText className="text-xs text-gray-400 mb-1">Título</AppText>
                        <AppText className="text-gray-100 text-sm">{displayValue(titles[activeLang])}</AppText>
                      </View>
                      <View className="mb-3">
                        <AppText className="text-xs text-gray-400 mb-1">Descrição</AppText>
                        <AppText className="text-gray-100 text-sm">{displayValue(descriptions[activeLang])}</AppText>
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
                        <AppText className="text-sm font-semibold text-gray-200">Grupos ({groups.length})</AppText>
                        <AppText className="text-xs text-gray-400">
                          {groups.reduce((total, group) => total + group.questions.length, 0)} perguntas
                        </AppText>
                      </View>
                      {groups.map((group, groupIdx) => (
                        <View key={groupIdx} className="mb-4">
                          <AppText className="text-gray-200 font-semibold">
                            {group.group[activeLang].trim() || "Sem grupo"}
                          </AppText>
                          {group.questions.map((question, qIdx) => (
                            <View key={qIdx} className="ml-3 mt-2">
                              <AppText className="text-xs text-gray-300">
                                {qIdx + 1}. {displayValue(question.text[activeLang])} (
                                {formatDescType(question.descType)})
                              </AppText>
                              {question.descType === "Dropdown" && question.options.length > 0 && (
                                <View className="ml-3 mt-1">
                                  {question.options.map((opt, optIdx) => (
                                    <AppText key={optIdx} className="text-xs text-gray-400">
                                      {optIdx + 1}. {displayValue(opt.description[activeLang])}
                                    </AppText>
                                  ))}
                                </View>
                              )}
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </>
                )}

                <View className="flex-row justify-between mt-6 gap-2">
                  {step > 0 && (
                    <Button title="Voltar" variant="secondary" onPress={() => setStep((s) => s - 1)} width="48%" />
                  )}
                  {step < 2 && (
                    <Button
                      title="Avançar"
                      variant="primary"
                      width={step > 0 ? "48%" : "100%"}
                      onPress={handleStepclick}
                    />
                  )}
                  {step === 2 && (
                    <Button
                      title="Criar Formulário"
                      variant="success"
                      width="48%"
                      isLoading={isCreating}
                      disabled={isCreating}
                      onPress={() => {
                        if (!canSubmitForm()) return;
                        setShowCreateModal(true);
                      }}
                    />
                  )}
                </View>
              </View>
            )}

            <View className="mb-4">
              <AppText className="text-lg font-bold text-gray-100 mb-3">Formulários Disponíveis</AppText>
              {isLoading ? (
                <Loading message="A carregar Formulários..." size="large" />
              ) : forms.length === 0 ? (
                <View className="rounded-xl p-6 bg-white/5 border border-white/10 items-center">
                  <FontAwesome5 name="clipboard-list" size={32} color="rgba(255,255,255,0.3)" />
                  <AppText className="text-gray-400 mt-3">Nenhum formulário disponível</AppText>
                </View>
              ) : (
                <View className="gap-3">
                  {forms.map((form) => {
                    const groupCount = getGroupCount(form);
                    const questionCount = getQuestionCount(form);
                    const types = getDescTypes(form);
                    return (
                      <View key={form.id} className="rounded-xl p-5 bg-white/5 border border-white/10">
                        <View className="flex-row items-start justify-between mb-2">
                          <View className="flex-1">
                            <AppText className="text-base font-bold text-gray-100 mb-1">{form.title}</AppText>
                            <AppText className="text-sm text-gray-300">{form.description}</AppText>
                          </View>
                          <View className="flex-row items-center gap-3">
                            <FontAwesome5 name="clipboard-check" size={18} color="#60a5fa" />
                            <TouchableOpacity
                              onPress={() => {
                                setFormToDelete({ id: form.id, title: form.title });
                                setShowDeleteModal(true);
                              }}
                            >
                              <FontAwesome5 name="trash" size={16} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View className="flex-row flex-wrap items-center gap-4 mt-3">
                          <View className="flex-row items-center gap-1">
                            <FontAwesome5 name="calendar" size={12} color="rgba(255,255,255,0.5)" />
                            <AppText className="text-xs text-gray-400">
                              Expira: {new Date(form.dateExpiration).toLocaleDateString("pt-PT")}
                            </AppText>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <FontAwesome5 name="layer-group" size={12} color="rgba(255,255,255,0.5)" />
                            <AppText className="text-xs text-gray-400">{groupCount} grupo(s)</AppText>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <FontAwesome5 name="list-ul" size={12} color="rgba(255,255,255,0.5)" />
                            <AppText className="text-xs text-gray-400">{questionCount} pergunta(s)</AppText>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <FontAwesome5 name="language" size={12} color="rgba(255,255,255,0.5)" />
                            <AppText className="text-xs text-gray-400">{form.language}</AppText>
                          </View>
                        </View>

                        {types.length > 0 && (
                          <View className="flex-row flex-wrap gap-2 mt-3">
                            {types.map((type) => (
                              <View key={type} className="rounded-full px-2.5 py-1 bg-white/5 border border-white/10">
                                <AppText className="text-[10px] text-gray-300">{formatDescType(type)}</AppText>
                              </View>
                            ))}
                          </View>
                        )}

                        {form.questionGroups?.length ? (
                          <View className="border-t border-white/10 mt-3 pt-3">
                            <AppText className="text-xs text-gray-400 mb-2">Grupos</AppText>
                            {form.questionGroups.map((group) => (
                              <View key={group.id} className="flex-row items-center justify-between py-1">
                                <AppText className="text-sm text-gray-200">
                                  {group.group?.trim() || "Sem grupo"}
                                </AppText>
                                <AppText className="text-xs text-gray-400">{group.questions.length} perguntas</AppText>
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>
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
          message="Tem a certeza que deseja criar este formulário?"
          confirmText="Criar"
          cancelText="Cancelar"
          onConfirm={handleConfirmCreate}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isCreating}
        />
        <ConfirmModal
          visible={showDeleteModal}
          title="Eliminar formulário"
          message={`Tem a certeza que deseja eliminar o formulário${formToDelete?.title ? ` "${formToDelete.title}"` : ""}? Esta ação não pode ser revertida.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setFormToDelete(null);
          }}
          isLoading={isDeleting}
          isDangerous
        />
      </AppLayout>
    </GestureHandlerRootView>
  );
}
