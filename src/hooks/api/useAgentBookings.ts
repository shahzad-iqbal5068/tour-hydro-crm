"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import type { AgentBookingRow } from "@/types/AgentBookingTypes";
import { queryKeys } from "./queryKeys";
import {
  DEFAULT_STALE_MS,
  normalizeQueryError,
  wrapMutationResult,
} from "./queryHelpers";

type AgentBookingsResponse = { data: (AgentBookingRow & { _id?: string })[] };

export function useAgentBookings() {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.agentBookings(),
    queryFn: () =>
      apiFetcher<AgentBookingsResponse>("/api/agent-bookings"),
    staleTime: DEFAULT_STALE_MS,
  });

  const data: AgentBookingRow[] =
    response?.data.map((doc) => ({
      id: (doc._id ?? doc.id) as string,
      customerName: doc.customerName,
      cruiseName: doc.cruiseName ?? "",
      pax: doc.pax ?? 0,
      contact: doc.contact,
      date: doc.date ?? "",
      time: doc.time ?? "",
      payment: doc.payment ?? "",
      b2b: doc.b2b ?? "",
      htCommission: doc.htCommission ?? "",
      agentCommission: doc.agentCommission ?? "",
      cameStatus: doc.cameStatus,
      cameCustomText: doc.cameCustomText,
    })) ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.agentBookings() });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiMutation<AgentBookingRow>("/api/agent-bookings", "POST", body),
    onSuccess: () => invalidate(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      apiMutation<AgentBookingRow>(
        `/api/agent-bookings?id=${encodeURIComponent(id)}`,
        "PUT",
        body
      ),
    onSuccess: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<{ message: string }>(
        `/api/agent-bookings?id=${encodeURIComponent(id)}`,
        "DELETE"
      ),
    onSuccess: () => invalidate(),
  });

  return {
    data,
    isLoading,
    error: normalizeQueryError(error),
    invalidate,
    createMutation: wrapMutationResult(createMutation),
    updateMutation: wrapMutationResult(updateMutation),
    deleteMutation: wrapMutationResult(deleteMutation),
  };
}

