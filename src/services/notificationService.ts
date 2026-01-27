import { apiClient } from "./apiClient";

interface PushNotificationPayload {
  title: string;
  message: string;
  screen?: string;
  publishAt?: string;
  publishUntil?: string;
}
interface GeneralNotificationPayload {
  title: string;
  description: string;
  url?: string;
  contentType?: "pdf" | "video" | "image";
  publishAt?: string;
  publishUntil?: string;
}

interface NotificationResponse {
  success: boolean;
  message: string;
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
  async testPushNotification(payload: PushNotificationPayload): Promise<NotificationResponse> {
    console.log("com payload:", JSON.stringify(payload, null, 2));
    try {
      const response = await apiClient.post<NotificationResponse>(`/notifications/test`, payload);
      return response.data;
    } catch (error) {
      console.error("Test notification error:", error);
      throw error;
    }
  }

  async broadcastPushNotification(payload: PushNotificationPayload): Promise<NotificationResponse> {
    console.log("Enviando notificação broadcast com payload:", JSON.stringify(payload, null, 2));
    try {
      const response = await apiClient.post<NotificationResponse>("/notifications/broadcast", payload);
      return response.data;
    } catch (error) {
      console.error("Broadcast notification error:", error);
      throw error;
    }
  }
  async generalNotification(payload: GeneralNotificationPayload): Promise<NotificationResponse> {
    console.log("com payload:", JSON.stringify(payload, null, 2));
    try {
      const response = await apiClient.post<NotificationResponse>(`/notifications/general`, payload);
      return response.data;
    } catch (error) {
      console.error("General notification error:", error);
      throw error;
    }
  }

  getScreenOptions(): SegmentOption[] {
    return SCREEN_OPTIONS;
  }
}

export const notificationService = new NotificationService();
