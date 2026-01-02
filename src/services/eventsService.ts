import { apiClient } from "./apiClient";
export type Language = "PT" | "EN" | "ES";
export type I18nText = Record<Language, string>;
export type QuestionDescType = "Dropdown" | "TextBox" | "Rating";

export interface EventForm {
  id: string;
  language: string;
  title: string;
  description: string;
  kpi: boolean;
  private: boolean;
  anonymous: boolean;
  reward: boolean;
  participation: boolean;
  status: boolean;
  dateExpiration: string;
  userCreation: string;
  dateCreation: string;
  userEdition: string;
  dateEdition: string;
  questionGroups?: QuestionGroup[];
}

export interface TranslatedFields {
  title: I18nText;
  description: I18nText;
}

export type QuestionForm = {
  text: I18nText;
  options: I18nText[];
  descType: QuestionDescType;
};

export interface FormQuestionOption {
  option: string;
  description: string;
  index: number;
  id?: number;
  idOptn?: number;
}

export interface FormQuestion {
  id?: string;
  idCab?: string;
  idQstn?: string;
  text: string;
  type: number;
  descType: QuestionDescType;
  index: number;
  required: boolean;
  options: FormQuestionOption[];
}

export interface QuestionGroup {
  id: number;
  group: string;
  questions: FormQuestion[];
}

export interface CreateFormOption {
  description: I18nText;
}

export interface CreateFormQuestion {
  text: I18nText;
  descType: QuestionDescType;
  required: boolean;
  options: CreateFormOption[];
}

export interface CreateFormGroup {
  group: I18nText;
  questions: CreateFormQuestion[];
}

export interface CreateFormPayload {
  formForm: TranslatedFields;
  dateExpiration: string;
  questionGroups: CreateFormGroup[];
}

export interface CreateEventPayload {
  eventForm: TranslatedFields;
  dateExpiration: string;
  questions: QuestionForm[];
}

export interface CreateRewardResponse {
  success: boolean;
  message: string;
  id?: string;
}

class EventsService {
  async getActiveEvents(lang: string = "PT", cv: string): Promise<EventForm[]> {
    try {
      const response = await apiClient.get<EventForm[]>(`/Form/Events/${cv}/${lang}`);

      if (response.status === 204) {
        return [];
      }

      console.log("Fetched active Events:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching active events:", error);
      throw error;
    }
  }

  async createEvent(payload: CreateEventPayload): Promise<void> {
    console.log("Creating event with payload:", JSON.stringify(payload, null, 2));
    try {
      await apiClient.post("/Form/Events", {
        eventForm: payload.eventForm,
        dateExpiration: payload.dateExpiration,
        questions: payload.questions,
      });
    } catch (error: any) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async createForm(payload: CreateFormPayload): Promise<void> {
    console.log("Creating form with payload:", JSON.stringify(payload, null, 2));
    try {
      await apiClient.post("/Form/Forms", {
        formForm: payload.formForm,
        dateExpiration: payload.dateExpiration,
        questionGroups: payload.questionGroups,
      });
    } catch (error: any) {
      console.error("Error creating form:", error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    // console.log("Deleting event with ID:", eventId);
    try {
      await apiClient.delete(`/Form/Events/${eventId}`);
    } catch (error: any) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }

  async deleteForm(formId: string): Promise<void> {
    try {
      await apiClient.delete(`/Form/Forms/${formId}`);
    } catch (error: any) {
      console.error("Error deleting form:", error);
      throw error;
    }
  }
}

export const eventsService = new EventsService();
