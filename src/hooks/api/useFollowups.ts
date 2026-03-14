"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetcher, apiMutation } from "@/lib/api";

export type FollowUpRow = {
  _id: string;
  category: "4-5" | "3";
  time: string;
  guestName: string;
  phone: string;
  followUpDate?: string | null;
  followUpNote?: string | null;
  followUpSent?: boolean;
};

export function useFollowups(date: string, category?: "all" | "4-5" | "3") {
  const categoryParam = category === "all" || !category ? undefined : category;
  const [data, setData] = useState<FollowUpRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(() => {
    if (!date) {
      setData([]);
      setIsLoading(false);
      return;
    }
    const params = new URLSearchParams({ date });
    if (categoryParam) params.set("category", categoryParam);
    setError(null);
    setIsLoading(true);
    apiFetcher<FollowUpRow[]>(`/api/followups?${params}`)
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setIsLoading(false));
  }, [date, categoryParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => fetchData(), [fetchData]);

  const [followUpPendingId, setFollowUpPendingId] = useState<string | null>(null);
  const followUpDoneMutation = {
    get variables() {
      return followUpPendingId ?? undefined;
    },
    get isPending() {
      return !!followUpPendingId;
    },
    mutateAsync: (id: string) => {
      setFollowUpPendingId(id);
      return apiMutation<FollowUpRow>(`/api/star-bookings/${id}/followup`, "PUT", {})
        .then(() => invalidate())
        .finally(() => setFollowUpPendingId(null));
    },
  };

  return {
    data,
    isLoading,
    error,
    invalidate,
    followUpDoneMutation,
  };
}

export function useFollowupsToday() {
  const [data, setData] = useState<FollowUpRow[]>([]);

  useEffect(() => {
    apiFetcher<FollowUpRow[]>("/api/followups/today")
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setData([]));
  }, []);

  return { data };
}
