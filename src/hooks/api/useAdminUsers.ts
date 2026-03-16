"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAdminUsers, saveAdminUser } from "@/lib/api";
import { queryKeys } from "./queryKeys";
import { FIVE_MIN_STALE_MS, normalizeQueryError, wrapMutationResult } from "./queryHelpers";

type SavePayload = {
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
};

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.adminUsers(),
    queryFn: fetchAdminUsers,
    staleTime: FIVE_MIN_STALE_MS,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: SavePayload) => saveAdminUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers() });
    },
  });

  return {
    users: data ?? [],
    isLoading,
    error: normalizeQueryError(error),
    refetch,
    saveMutation: wrapMutationResult(saveMutation),
  };
}
