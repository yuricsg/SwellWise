/**
 * API Service - Handles all HTTP requests to the backend
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  Beach,
  BeachList,
  BeachCondition,
  BeachForecast,
} from "@/types/beach";

/**
 * API Error type
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

/**
 * Create and configure axios instance
 */
const createApiClient = (): AxiosInstance => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const api = createApiClient();

/**
 * Handle API errors consistently
 */
const handleError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    return {
      message: axiosError.response?.data?.detail || axiosError.message || "Erro na requisição",
      status: axiosError.response?.status,
      details: axiosError.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Erro desconhecido",
  };
};

/**
 * Beach API endpoints
 */
export const beachService = {
  /**
   * Get all beaches with optional filters
   */
  async getBeaches(params?: {
    state?: string;
    city?: string;
    search?: string;
  }): Promise<BeachList> {
    try {
      const response = await api.get<BeachList>("/beaches", { params });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get a single beach by ID
   */
  async getBeachById(beachId: string): Promise<Beach> {
    try {
      const response = await api.get<Beach>(`/beaches/${beachId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get beaches by state
   */
  async getBeachesByState(stateUf: string): Promise<BeachList> {
    try {
      const response = await api.get<BeachList>(`/beaches/state/${stateUf}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

/**
 * Conditions API endpoints
 */
export const conditionService = {
  /**
   * Get current conditions for a beach
   */
  async getBeachConditions(beachId: string): Promise<BeachCondition> {
    try {
      const response = await api.get<BeachCondition>(`/conditions/${beachId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get extended forecast for a beach
   */
  async getBeachForecast(beachId: string, days: number = 7): Promise<BeachForecast> {
    try {
      const response = await api.get<BeachForecast>(`/conditions/${beachId}/forecast`, {
        params: { days: Math.min(Math.max(days, 1), 16) },
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

/**
 * Health check
 */
export const healthService = {
  async check(): Promise<boolean> {
    try {
      await api.get("/health");
      return true;
    } catch {
      return false;
    }
  },
};

export default api;
