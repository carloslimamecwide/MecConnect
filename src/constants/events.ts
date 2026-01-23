import type { I18nText, Language, QuestionForm } from "@/src/services/eventsService";

export const LANGUAGES: Language[] = ["PT", "EN", "ES"];
export const STEP_LABELS = ["Informações", "Perguntas", "Revisão"];
export const YES_NO_OPTIONS: I18nText[] = [
  { PT: "Sim", EN: "Yes", ES: "Sí" },
  { PT: "Não", EN: "No", ES: "No" },
];
export const displayValue = (value: string) => (value.trim() ? value : "-");

export const emptyI18n = (): I18nText => ({ PT: "", EN: "", ES: "" });
export const newQuestion = (): QuestionForm => ({
  text: emptyI18n(),
  options: [emptyI18n()],
  descType: "Dropdown",
});
