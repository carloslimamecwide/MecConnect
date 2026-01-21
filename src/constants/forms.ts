import type { Language, QuestionDescType } from "../services/eventsService";

export const LANGUAGES: Language[] = ["PT", "EN", "ES"];
export const STEP_LABELS = ["Informações", "Grupos", "Revisão"];
export const DESC_TYPES: QuestionDescType[] = ["TextBox", "Dropdown", "Rating"];

export const formatDescType = (value: QuestionDescType): string => {
  if (value === "TextBox") return "Texto";
  if (value === "Rating") return "Rating";
  return "Dropdown";
};
