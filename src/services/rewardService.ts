import { apiClient } from "./apiClient";

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
}

export interface RewardTranslation {
  language: string;
  title: string;
  description: string;
}

export interface CreateRewardPayload {
  translations: RewardTranslation[];
  dateExpiration: string;
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
    try {
      await apiClient.post("/Form/Rewards", {
        translations: payload.translations,
        dateExpiration: payload.dateExpiration,
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
}

export const rewardService = new RewardService();
