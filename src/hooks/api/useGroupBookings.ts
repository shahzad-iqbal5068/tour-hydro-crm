"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import type { GroupBookingRow } from "@/types/booking";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError, wrapMutationResult } from "./queryHelpers";

type GroupBookingsResponse = { data: GroupBookingRow[] };

export function useGroupBookings() {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.groupBookings(),
    queryFn: () => apiFetcher<GroupBookingsResponse>("/api/group-bookings"),
    staleTime: DEFAULT_STALE_MS,
  });

  const data = response?.data ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.groupBookings() });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiMutation<GroupBookingRow>("/api/group-bookings", "POST", body),
    onSuccess: () => invalidate(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      apiMutation<GroupBookingRow>(`/api/group-bookings/${id}`, "PUT", body),
    onSuccess: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<{ message: string }>(`/api/group-bookings/${id}`, "DELETE"),
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
  };
}
