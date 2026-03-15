"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetcher } from "@/lib/api";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError } from "./queryHelpers";

export type Period = "today" | "weekly" | "monthly" | "yearly";

type DashboardStats = {
  inquiries: number;
  bookings4to5: number;
  bookings3: number;
  bookingsTotal: number;
};

export function useDashboardStats(period: Period) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.dashboardStats(period),
    queryFn: () => apiFetcher<DashboardStats>(`/api/dashboard/stats?period=${period}`),
    staleTime: DEFAULT_STALE_MS,
  });

  return {
    data: data ?? null,
    isLoading,
    error: normalizeQueryError(error),
  };
}
