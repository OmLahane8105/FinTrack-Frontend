import api from "./api";

export interface AiInsightsResponse {
  summary: string;
  insights: string[];
  recommendations: string[];
}

export const getAiInsights =
  async (): Promise<AiInsightsResponse> => {
    const response =
  await api.get<AiInsightsResponse>(
    "/api/ai/insights",
    {
      timeout: 45000,
    }
  );

    return response.data;
  };