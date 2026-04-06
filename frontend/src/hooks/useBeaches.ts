/**
 * Custom hooks for beach data fetching
 */

import useSWR from "swr";
import { beachService, conditionService, ApiError } from "@/services/api";
import type {
  Beach,
  BeachList,
  BeachCondition,
  BeachForecast,
} from "@/types/beach";

/**
 * Hook to fetch all beaches
 */
export function useBeaches(params?: {
  state?: string;
  city?: string;
  search?: string;
}) {
  const { data, error, isLoading, mutate } = useSWR<BeachList, ApiError>(
    ["beaches", params],
    async () => beachService.getBeaches(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 300000, // 5 minutes
    }
  );

  return {
    beaches: data?.beaches || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch a single beach
 */
export function useBeach(beachId?: string) {
  const { data, error, isLoading, mutate } = useSWR<Beach, ApiError>(
    beachId ? ["beach", beachId] : null,
    async () => {
      if (!beachId) throw new Error("Beach ID is required");
      return beachService.getBeachById(beachId);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    beach: data,
    isLoading: isLoading && !data,
    error,
    mutate,
  };
}

/**
 * Hook to fetch beach conditions (current)
 */
export function useBeachConditions(beachId?: string) {
  const { data, error, isLoading, mutate } = useSWR<BeachCondition, ApiError>(
    beachId ? ["conditions", beachId] : null,
    async () => {
      if (!beachId) throw new Error("Beach ID is required");
      return conditionService.getBeachConditions(beachId);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    conditions: data,
    isLoading: isLoading && !data,
    error,
    mutate,
  };
}

/**
 * Hook to fetch beach forecast
 */
export function useBeachForecast(beachId?: string, days: number = 7) {
  const { data, error, isLoading, mutate } = useSWR<BeachForecast, ApiError>(
    beachId ? ["forecast", beachId, days] : null,
    async () => {
      if (!beachId) throw new Error("Beach ID is required");
      return conditionService.getBeachForecast(beachId, days);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  return {
    forecast: data,
    isLoading: isLoading && !data,
    error,
    mutate,
  };
}

/**
 * Hook to fetch beaches by state
 */
export function useBeachesByState(state?: string) {
  const { data, error, isLoading, mutate } = useSWR<BeachList, ApiError>(
    state ? ["beaches-state", state] : null,
    async () => {
      if (!state) throw new Error("State is required");
      return beachService.getBeachesByState(state);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    beaches: data?.beaches || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
}
