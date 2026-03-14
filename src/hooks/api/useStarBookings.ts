"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetcher, apiMutation } from "@/lib/api";

type StarBookingRow = {
  _id: string;
  category: "4-5" | "3";
  time: string;
  pax: number;
  guestName: string;
  phone: string;
  collectionAmount: number;
  paid: number;
  balance: number;
  deck?: string;
  remarks?: string;
  callingRemarks?: string;
  followUpDate?: string | null;
  followUpSent?: boolean;
  followUpNote?: string | null;
};

type StarBookingsResponse = { data: StarBookingRow[] };

function usePendingMutation() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  return {
    get variables() {
      return pendingId ?? undefined;
    },
    get isPending() {
      return !!pendingId;
    },
    run: async <T>(id: string, fn: () => Promise<T>) => {
      setPendingId(id);
      try {
        return await fn();
      } finally {
        setPendingId(null);
      }
    },
  };
}

export function useStarBookings(category?: "4-5" | "3" | "all") {
  const effectiveCategory = category === "all" ? undefined : category;
  const [data, setData] = useState<StarBookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const url = effectiveCategory
        ? `/api/star-bookings?category=${effectiveCategory}`
        : "/api/star-bookings";
      const res = await apiFetcher<StarBookingsResponse>(url);
      setData(res?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [effectiveCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => fetchData(), [fetchData]);

  const deletePending = usePendingMutation();
  const followUpPending = usePendingMutation();

  const createMutation = {
    mutateAsync: (body: Record<string, unknown>) =>
      apiMutation<StarBookingRow>("/api/star-bookings", "POST", body).then(() =>
        invalidate()
      ),
    isPending: false,
  };

  const updateMutation = {
    mutateAsync: ({
      id,
      body,
    }: { id: string; body: Record<string, unknown> }) =>
      apiMutation<StarBookingRow>(`/api/star-bookings/${id}`, "PUT", body).then(
        () => invalidate()
      ),
    isPending: false,
  };

  const deleteMutation = {
    get variables() {
      return deletePending.variables;
    },
    get isPending() {
      return deletePending.isPending;
    },
    mutateAsync: (id: string) =>
      deletePending.run(id, () =>
        apiMutation<{ message: string }>(
          `/api/star-bookings/${id}`,
          "DELETE"
        ).then(() => invalidate())
      ),
  };

  const followUpDoneMutation = {
    get variables() {
      return followUpPending.variables;
    },
    get isPending() {
      return followUpPending.isPending;
    },
    mutateAsync: (id: string) =>
      followUpPending.run(id, () =>
        apiMutation<StarBookingRow>(
          `/api/star-bookings/${id}/followup`,
          "PUT",
          {}
        ).then(() => invalidate())
      ),
  };

  return {
    data,
    isLoading,
    error,
    invalidate,
    createMutation,
    updateMutation,
    deleteMutation,
    followUpDoneMutation,
  };
}
