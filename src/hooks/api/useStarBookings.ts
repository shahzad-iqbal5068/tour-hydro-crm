"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import type { StarBookingRow } from "@/types/booking";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError, wrapMutationResult } from "./queryHelpers";

type StarBookingsResponse = { data: StarBookingRow[] };

export function useStarBookings(category?: "4-5" | "3" | "all") {
  const effectiveCategory = category === "all" ? undefined : category;
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.starBookings(effectiveCategory),
    queryFn: async () => {
      const url = effectiveCategory
        ? `/api/star-bookings?category=${effectiveCategory}`
        : "/api/star-bookings";
      return apiFetcher<StarBookingsResponse>(url);
    },
    staleTime: DEFAULT_STALE_MS,
  });

  const data = response?.data ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.starBookings(effectiveCategory) });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiMutation<StarBookingRow>("/api/star-bookings", "POST", body),
    onSuccess: () => invalidate(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      apiMutation<StarBookingRow>(`/api/star-bookings/${id}`, "PUT", body),
    onSuccess: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<{ message: string }>(`/api/star-bookings/${id}`, "DELETE"),
    onSuccess: () => invalidate(),
  });

  const followUpDoneMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<StarBookingRow>(`/api/star-bookings/${id}/followup`, "PUT", {}),
    onSuccess: () => invalidate(),
  });

  return {
    data,
    isLoading,
    error: normalizeQueryError(error),
    invalidate,
    createMutation: wrapMutationResult(createMutation),
    updateMutation: wrapMutationResult(updateMutation),
    deleteMutation: wrapMutationResult(deleteMutation, { includeVariables: true }),
    followUpDoneMutation: wrapMutationResult(followUpDoneMutation, { includeVariables: true }),
  };
}
