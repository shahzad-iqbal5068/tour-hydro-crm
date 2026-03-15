"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetcher } from "@/lib/api";
import { queryKeys } from "./queryKeys";
import { normalizeQueryError, FIVE_MIN_STALE_MS } from "./queryHelpers";

export type UserOption = { id: string; name: string };

export function useUsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.usersList(),
    queryFn: () => apiFetcher<UserOption[]>("/api/users/list"),
    staleTime: FIVE_MIN_STALE_MS,
  });

  return {
    data: data ?? [],
    isLoading,
    error: normalizeQueryError(error),
  };
}
