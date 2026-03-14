"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetcher, apiMutation } from "@/lib/api";

export type GroupBookingRow = {
  _id: string;
  groupBookingName: string;
  guestName: string;
  contactWhatsapp: string;
  groupsCount: number;
  cruiseName: string;
  numberOfPax: number;
  timeSlot: string;
  inquiryDate?: string | null;
  confirmDate?: string | null;
  bookingStatusRemarks?: string | null;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  callingDate?: string | null;
  remarks?: string | null;
};

type GroupBookingsResponse = { data: GroupBookingRow[] };

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

export function useGroupBookings() {
  const [data, setData] = useState<GroupBookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await apiFetcher<GroupBookingsResponse>("/api/group-bookings");
      setData(res?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => fetchData(), [fetchData]);
  const deletePending = usePendingMutation();

  const createMutation = {
    mutateAsync: (body: Record<string, unknown>) =>
      apiMutation<GroupBookingRow>("/api/group-bookings", "POST", body).then(() => invalidate()),
    isPending: false,
  };

  const updateMutation = {
    mutateAsync: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      apiMutation<GroupBookingRow>(`/api/group-bookings/${id}`, "PUT", body).then(() => invalidate()),
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
        apiMutation<{ message: string }>(`/api/group-bookings/${id}`, "DELETE").then(() => invalidate())
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
  };
}
