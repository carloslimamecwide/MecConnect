import { apiClient } from "./apiClient";
import type { I18nText } from "./eventsService";

export interface RewardForm {
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
  numberOfWinners: number;
}

export interface RewardFormFields {
  title: I18nText;
  description: I18nText;
}

export interface CreateRewardPayload {
  rewardForm: RewardFormFields;
  dateExpiration: string;
  numberOfWinners: number;
}

export interface CreateRewardResponse {
  success: boolean;
  message: string;
  id?: string;
}

class RewardService {
  async getActiveRewards(lang: string = "PT"): Promise<RewardForm[]> {
    try {
      const response = await apiClient.get<RewardForm[]>(`/Form/Rewards/Active/${lang}`);

      if (response.status === 204) {
        return [];
      }

      console.log("Fetched active rewards:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error("Error fetching active rewards:", error);
      throw error;
    }
  }

  async createReward(payload: CreateRewardPayload): Promise<void> {
    console.log("Creating reward with payload:", JSON.stringify(payload, null, 2));
    try {
      await apiClient.post("/Form/Rewards", {
        rewardForm: payload.rewardForm,
        dateExpiration: payload.dateExpiration,
        numberOfWinners: payload.numberOfWinners,
      });
    } catch (error: any) {
      console.error("Error creating reward:", error);
      throw error;
    }
  }

  async deleteReward(rewardId: string): Promise<void> {
    try {
      await apiClient.delete(`/Form/Rewards/${rewardId}`);
    } catch (error: any) {
      console.error("Error deleting reward:", error);
      throw error;
    }
  }
  async drawWinners(rewardId: string, numberOfWinners: number): Promise<void> {
    console.log("Drawing winners for reward ID:", rewardId, "Number of winners:", numberOfWinners);
    try {
      await apiClient.post(`/Form/RandomWinners/${rewardId}/${numberOfWinners}`);
    } catch (error: any) {
      console.error("Error drawing winners for reward:", error);
      throw error;
    }
  }
}

export const rewardService = new RewardService();
