import { LANGUAGES } from "@/src/constants/forms";
import type { EventForm } from "@/src/services/eventsService";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { AppText } from "../Common/AppText";
import Loading from "../Common/Loading";

type FormListProps = {
  forms: EventForm[];
  isLoading: boolean;
  setFormToDelete: (form: { id: string; title: string } | null) => void;
  setShowDeleteModal: (show: boolean) => void;
};

function FormList({ forms, isLoading, setFormToDelete, setShowDeleteModal }: FormListProps) {
  return (
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
                  {LANGUAGES.map((lang) => (
                    <View key={lang} className="flex-row items-center gap-1">
                      <FontAwesome5 name="language" size={12} color="rgba(255,255,255,0.5)" />
                      <AppText className="text-xs text-gray-400">{lang}</AppText>
                    </View>
                  ))}
                </View>

                {form.questionGroups?.length ? (
                  <View className="border-t border-white/10 mt-3 pt-3">
                    <AppText className="text-xs text-gray-400 mb-2">Grupos</AppText>
                    {form.questionGroups.map((group) => (
                      <View key={group.id} className="flex-row items-center justify-between py-1">
                        <AppText className="text-sm text-gray-200">{group.group?.trim() || "Sem grupo"}</AppText>
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
  );
}

export default FormList;
