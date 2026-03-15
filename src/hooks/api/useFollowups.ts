"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import type { FollowUpRow } from "@/types/followup";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError, wrapMutationResult } from "./queryHelpers";

function buildFollowupsUrl(date: string, category?: string): string {
  const params = new URLSearchParams({ date });
  if (category) params.set("category", category);
  return `/api/followups?${params.toString()}`;
}

export function useFollowups(date: string, category?: "all" | "4-5" | "3") {
  const categoryParam = category === "all" || !category ? undefined : category;
  const queryClient = useQueryClient();

  const {
    data: rawData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.followups(date, categoryParam),
    queryFn: async () => {
      const res = await apiFetcher<FollowUpRow[]>(buildFollowupsUrl(date, categoryParam));
      return Array.isArray(res) ? res : [];
    },
    enabled: !!date,
    staleTime: DEFAULT_STALE_MS,
  });

  const data = rawData ?? [];
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.followups(date, categoryParam) });

  const followUpDoneMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<FollowUpRow>(`/api/bookings/${id}/followup`, "PUT", {}),
    onSuccess: () => invalidate(),
  });

  return {
    data,
    isLoading,
    error: normalizeQueryError(error),
    invalidate,
    followUpDoneMutation: wrapMutationResult(followUpDoneMutation, {
      includeVariables: true,
    }),
  };
}

export function useFollowupsToday() {
  const { data: rawData } = useQuery({
    queryKey: queryKeys.followupsToday(),
    queryFn: async () => {
      const res = await apiFetcher<FollowUpRow[]>("/api/followups/today");
      return Array.isArray(res) ? res : [];
    },
    staleTime: DEFAULT_STALE_MS,
  });

  return { data: rawData ?? [] };
}
