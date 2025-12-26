import { apiClient } from "./apiClient";

interface NotificationPayload {
  title: string;
  message: string;
  segment?: string;
  screen?: string;
}

interface NotificationResponse {
  success: boolean;
  message: string;
}

interface User {
  cv: string;
  nome: string;
  desc_ax2: string;
  email_prof: string;
  [key: string]: any;
}

interface SegmentOption {
  value: string;
  label: string;
}

const SCREEN_OPTIONS: SegmentOption[] = [
  // Cultura
  { value: "FormNavigation", label: "Cultura - Formularios" },
  { value: "EventsNavigation", label: "Cultura - Eventos" },
  { value: "Rewards", label: "Recompensas" },
  { value: "CommunicationNavigation", label: "Comunicação Geral" },
  // Away On
  { value: "AwayOn", label: "Away On - Módulo" },
  // Holiday
  { value: "MWHolidays", label: "Holiday - Gestão de Férias" },
  // Support
  { value: "Support", label: "Support - Apoio IT" },
  // Innovation
  { value: "Innovation", label: "Innovation - Inovação" },
  // MFC
  { value: "MFCNavigation", label: "MFC - Módulo" },
  { value: "ManualMFC", label: "MFC - Manual de Condutor" },
  { value: "RegisterFuel", label: "MFC - Registro de Faturas de Combustível" },
  // Booking - Viaturas
  { value: "CarBooking", label: "Booking Viaturas - Pedido de Viatura" },
  { value: "CarBookingNavigation", label: "Booking Viaturas - Gestão de Bookings" },
  { value: "MWBooking", label: "Booking Viaturas - Bookings Gerais" },
  { value: "ShareCarBooking", label: "Booking Viaturas - Partilha de Viagem" },
  // Booking - Alojamento
  { value: "HouseBookingNavigation", label: "Booking Alojamento - Módulo" },
  { value: "Navigation", label: "Pagina Principal - Home Page" },
];

class NotificationService {
  async testNotification(cv: string, token: string, payload: NotificationPayload): Promise<NotificationResponse> {
    try {
      const response = await apiClient.post<NotificationResponse>(`/notifications/test/${cv}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Test notification error:", error);
      throw error;
    }
  }

  async broadcastNotification(token: string, payload: NotificationPayload): Promise<NotificationResponse> {
    try {
      const response = await apiClient.post<NotificationResponse>("/notifications/broadcast", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Broadcast notification error:", error);
      throw error;
    }
  }

  async fetchSegments(token: string): Promise<SegmentOption[]> {
    try {
      const response = await apiClient.get<User[]>("/HierarchyMatrix?status=active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetch segments response status:", response.status);
      const users = response.data;

      // Extrair desc_ax2 únicos e criar options
      const uniqueSegments = new Set<string>();
      users.forEach((user) => {
        if (user.desc_ax2) {
          uniqueSegments.add(user.desc_ax2);
        }
      });

      const segments: SegmentOption[] = Array.from(uniqueSegments)
        .sort()
        .map((segment) => ({
          value: segment,
          label: segment,
        }));

      return segments;
    } catch (error) {
      console.error("Fetch segments error:", error);
      throw error;
    }
  }

  getScreenOptions(): SegmentOption[] {
    return SCREEN_OPTIONS;
  }
}

export const notificationService = new NotificationService();
