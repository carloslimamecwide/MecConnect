const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

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
];

class NotificationService {
  async testNotification(cv: string, token: string, payload: NotificationPayload): Promise<NotificationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/test/${cv}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
      }

      const data: NotificationResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Test notification error:", error);
      throw error;
    }
  }

  async broadcastNotification(token: string, payload: NotificationPayload): Promise<NotificationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
      }

      const data: NotificationResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Broadcast notification error:", error);
      throw error;
    }
  }

  async fetchSegments(token: string): Promise<SegmentOption[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/HierarchyMatrix?status=active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      console.log("Fetch segments response status:", response.status);
      const users: User[] = await response.json();

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
