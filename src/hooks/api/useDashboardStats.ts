"use client";

import { useEffect, useState } from "react";
import { apiFetcher } from "@/lib/api";

export type Period = "today" | "weekly" | "monthly" | "yearly";

type DashboardStats = {
  inquiries: number;
  bookings4to5: number;
  bookings3: number;
  bookingsTotal: number;
};

export function useDashboardStats(period: Period) {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    apiFetcher<DashboardStats>(`/api/dashboard/stats?period=${period}`)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return { data, isLoading, error };
}
