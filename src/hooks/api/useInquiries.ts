"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetcher, apiMutation } from "@/lib/api";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError, SHORT_STALE_MS, wrapMutationResult } from "./queryHelpers";
import type { InquiryRow, InquiryFormValues } from "@/types";

type InquiriesResponse = { data: InquiryRow[]; total?: number };

async function fetchInquiries(): Promise<InquiriesResponse> {
  const params = new URLSearchParams({
    page: "1",
    limit: "1000",
    sortDate: "desc",
  });
  return apiFetcher<InquiriesResponse>(`/api/inquiries?${params}`);
}

export function useInquiries() {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.inquiries(),
    queryFn: fetchInquiries,
    staleTime: DEFAULT_STALE_MS,
  });

  const data = response?.data ?? [];
  const total = response?.total ?? 0;

  const createMutation = useMutation({
    mutationFn: (body: Partial<InquiryFormValues> & {
      date: string;
      shift: string;
      whatsappName: string;
    }) => apiMutation<InquiryRow>("/api/inquiries", "POST", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries() }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<InquiryFormValues> }) =>
      apiMutation<InquiryRow>(`/api/inquiries/${id}`, "PUT", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries() }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiMutation<{ message: string }>(`/api/inquiries/${id}`, "DELETE"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries() }),
  });

  return {
    data,
    total,
    isLoading,
    error: error instanceof Error ? error : null,
    invalidate: () => queryClient.invalidateQueries({ queryKey: queryKeys.inquiries() }),
    createMutation: {
      mutateAsync: createMutation.mutateAsync,
      isPending: createMutation.isPending,
    },
    updateMutation: {
      mutateAsync: updateMutation.mutateAsync,
      isPending: updateMutation.isPending,
    },
    deleteMutation: {
      mutateAsync: deleteMutation.mutateAsync,
      isPending: deleteMutation.isPending,
    },
  };
}

export function useInquiry(id: string | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.inquiry(id),
    queryFn: () => apiFetcher<InquiryRow>(`/api/inquiries/${id}`),
    enabled: !!id,
    staleTime: SHORT_STALE_MS,
  });

  return {
    data: data ?? null,
    isLoading,
    error: normalizeQueryError(error),
  };
}
