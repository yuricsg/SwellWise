/**
 * Custom hooks for beach data fetching
 */

import { useState, useCallback } from "react";
import useSWR from "swr";
import { beachService, conditionService, ApiError, GetBeachesParams } from "@/services/api";
import type {
  Beach,
  BeachList,
  BeachCondition,
  BeachForecast,
} from "@/types/beach";

const PAGE_SIZE = 6;

/**
 * Hook de praias com paginação acumulativa e filtro de estado
 * Cada clique em "Mostrar mais" adiciona PAGE_SIZE praias sem limpar as anteriores
 */
export function useBeachesPaginated(params?: { state?: string; search?: string }) {
  const [offset, setOffset] = useState(0);
  const [allBeaches, setAllBeaches] = useState<Beach[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Chave SWR inclui filtros — muda quando filtro muda, reinicia acumulação
  const swrKey: GetBeachesParams = {
    limit: PAGE_SIZE,
    offset: 0,
    state: params?.state || undefined,
    search: params?.search || undefined,
  };

  const { isLoading, error, mutate } = useSWR<BeachList, ApiError>(
    ["beaches-paginated", swrKey],
    async () => beachService.getBeaches(swrKey),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      onSuccess: (data) => {
        // Quando filtro muda, SWR revalida com offset=0 → reinicia lista
        setAllBeaches(data.beaches);
        setTotal(data.total);
        setHasMore(data.has_more);
        setOffset(data.limit);
      },
    }
  );

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const params_: GetBeachesParams = {
        limit: PAGE_SIZE,
        offset,
        state: params?.state || undefined,
        search: params?.search || undefined,
      };
      const data = await beachService.getBeaches(params_);
      setAllBeaches((prev) => [...prev, ...data.beaches]);
      setTotal(data.total);
      setHasMore(data.has_more);
      setOffset((prev) => prev + data.beaches.length);
    } catch (e) {
      console.error("Erro ao carregar mais praias:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, offset, params?.state, params?.search]);

  return {
    beaches: allBeaches,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    mutate,
  };
}

/**
 * Hook legado para compatibilidade (busca sem paginação)
 */
export function useBeaches(params?: { state?: string; city?: string; search?: string }) {
  const { data, error, isLoading, mutate } = useSWR<BeachList, ApiError>(
    ["beaches", params],
    async () => beachService.getBeaches({ ...params, limit: 100 }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
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

/**
 * Hook to fetch a single beach by ID
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
 * Hook to fetch beach conditions (current) — Open-Meteo + Groq
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
      dedupingInterval: 300000, // 5 minutos (backend já tem cache de 30min)
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
      dedupingInterval: 600000, // 10 minutos
    }
  );

  return {
    forecast: data,
    isLoading: isLoading && !data,
    error,
    mutate,
  };
}
