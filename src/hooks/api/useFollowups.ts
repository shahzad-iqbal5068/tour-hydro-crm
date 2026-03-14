"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import { queryKeys } from "./queryKeys";

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
  const queryClient = useQueryClient();
  const categoryParam = category === "all" || !category ? undefined : category;

  const query = useQuery({
    queryKey: queryKeys.followups(date, categoryParam),
    queryFn: async () => {
      const params = new URLSearchParams({ date });
      if (categoryParam) params.set("category", categoryParam);
      return apiFetcher<FollowUpRow[]>(`/api/followups?${params}`);
    },
    enabled: Boolean(date),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["followups"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.followupsToday() });
  };

  const followUpDoneMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<FollowUpRow>(`/api/star-bookings/${id}/followup`, "PUT", {}),
    onSuccess: () => invalidate(),
  });

  return {
    ...query,
    data: Array.isArray(query.data) ? query.data : [],
    invalidate,
    followUpDoneMutation,
  };
}

export function useFollowupsToday() {
  return useQuery({
    queryKey: queryKeys.followupsToday(),
    queryFn: () => apiFetcher<FollowUpRow[]>("/api/followups/today"),
  });
}
