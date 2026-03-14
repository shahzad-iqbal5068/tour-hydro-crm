"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import { queryKeys } from "./queryKeys";
import type { InquiryRow, InquiryFormValues } from "@/types";

type InquiriesResponse = { data: InquiryRow[]; total?: number };

export function useInquiries() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.inquiries(),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "1000",
        sortDate: "desc",
      });
      return apiFetcher<InquiriesResponse>(`/api/inquiries?${params}`);
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.inquiries() });

  const createMutation = useMutation({
    mutationFn: (
      body: Partial<InquiryFormValues> & {
        date: string;
        shift: string;
        whatsappName: string;
      }
    ) => apiMutation<InquiryRow>("/api/inquiries", "POST", body),
    onSuccess: () => invalidate(),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: { id: string; body: Partial<InquiryFormValues> }) =>
      apiMutation<InquiryRow>(`/api/inquiries/${id}`, "PUT", body),
    onSuccess: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<{ message: string }>(`/api/inquiries/${id}`, "DELETE"),
    onSuccess: () => invalidate(),
  });

  return {
    ...query,
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    invalidate,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

export function useInquiry(id: string | null) {
  return useQuery({
    queryKey: queryKeys.inquiry(id),
    queryFn: () => apiFetcher<InquiryRow>(`/api/inquiries/${id!}`),
    enabled: Boolean(id),
  });
}
