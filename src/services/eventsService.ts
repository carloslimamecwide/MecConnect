import { apiClient } from "./apiClient";
export type Language = "PT" | "EN" | "ES";
export type I18nText = Record<Language, string>;

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
}

export interface EventTranslation {
  language: string;
  title: string;
  description: string;
}

export type QuestionForm = {
  text: I18nText;
  options: I18nText[];
  descType: "Dropdown";
};

export interface CreateEventPayload {
  eventForm: EventTranslation[];
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

  async deleteEvent(eventId: string): Promise<void> {
    // console.log("Deleting event with ID:", eventId);
    try {
      await apiClient.delete(`/Form/Events/${eventId}`);
    } catch (error: any) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}

export const eventsService = new EventsService();
