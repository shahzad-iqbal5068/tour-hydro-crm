"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import { queryKeys } from "./queryKeys";

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

export function useStarBookings(category?: "4-5" | "3" | "all") {
  const queryClient = useQueryClient();
  const effectiveCategory = category === "all" ? undefined : category;

  const query = useQuery({
    queryKey: queryKeys.starBookings(effectiveCategory),
    queryFn: async () => {
      const url = effectiveCategory
        ? `/api/star-bookings?category=${effectiveCategory}`
        : "/api/star-bookings";
      return apiFetcher<StarBookingsResponse>(url);
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["star-bookings"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.followupsToday() });
    queryClient.invalidateQueries({ queryKey: ["followups"] });
  };

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
    ...query,
    data: query.data?.data ?? [],
    invalidate,
    createMutation,
    updateMutation,
    deleteMutation,
    followUpDoneMutation,
  };
}
