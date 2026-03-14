"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetcher, apiMutation } from "@/lib/api";
import type { InquiryRow, InquiryFormValues } from "@/types";

type InquiriesResponse = { data: InquiryRow[]; total?: number };

export function useInquiries() {
  const [data, setData] = useState<InquiryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "1000",
        sortDate: "desc",
      });
      const res = await apiFetcher<InquiriesResponse>(`/api/inquiries?${params}`);
      setData(res?.data ?? []);
      setTotal(res?.total ?? 0);
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

  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

  const createMutation = {
    mutateAsync: (
      body: Partial<InquiryFormValues> & {
        date: string;
        shift: string;
        whatsappName: string;
      }
    ) =>
      apiMutation<InquiryRow>("/api/inquiries", "POST", body).then(() =>
        invalidate()
      ),
    isPending: false,
  };

  const updateMutation = {
    mutateAsync: ({
      id,
      body,
    }: { id: string; body: Partial<InquiryFormValues> }) =>
      apiMutation<InquiryRow>(`/api/inquiries/${id}`, "PUT", body).then(() =>
        invalidate()
      ),
    isPending: false,
  };

  const deleteMutation = {
    get isPending() {
      return !!deletePendingId;
    },
    mutateAsync: (id: string) => {
      setDeletePendingId(id);
      return apiMutation<{ message: string }>(`/api/inquiries/${id}`, "DELETE")
        .then(() => invalidate())
        .finally(() => setDeletePendingId(null));
    },
  };

  return {
    data,
    total,
    isLoading,
    error,
    invalidate,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}

export function useInquiry(id: string | null) {
  const [data, setData] = useState<InquiryRow | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setError(null);
    setIsLoading(true);
    apiFetcher<InquiryRow>(`/api/inquiries/${id}`)
      .then((res) => {
        if (!cancelled) setData(res);
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
  }, [id]);

  return { data, isLoading, error };
}
