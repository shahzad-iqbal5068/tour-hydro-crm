"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPerformance } from "@/lib/api";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError } from "./queryHelpers";

export function useAdminPerformance(range: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.adminPerformance(range),
    queryFn: () => fetchPerformance(range),
    staleTime: DEFAULT_STALE_MS,
  });

  return {
    data: data ?? null,
    isLoading,
    error: normalizeQueryError(error),
  };
}
