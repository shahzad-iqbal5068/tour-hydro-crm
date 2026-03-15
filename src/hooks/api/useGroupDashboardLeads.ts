"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import type { GroupDashboardLeadRow } from "@/types/groupDashboard";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError, wrapMutationResult } from "./queryHelpers";

type GroupDashboardLeadsResponse = { data: GroupDashboardLeadRow[] };

export function useGroupDashboardLeads() {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.groupDashboardLeads(),
    queryFn: () => apiFetcher<GroupDashboardLeadsResponse>("/api/group-dashboard-leads"),
    staleTime: DEFAULT_STALE_MS,
  });

  const data = response?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiMutation<GroupDashboardLeadRow>("/api/group-dashboard-leads", "POST", body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.groupDashboardLeads() }),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.groupDashboardLeads() });

  return {
    data,
    isLoading,
    error: normalizeQueryError(error),
    invalidate,
    createMutation: wrapMutationResult(createMutation),
  };
}
