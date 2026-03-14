"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetcher } from "@/lib/api";
import { queryKeys } from "./queryKeys";

export type UserOption = { id: string; name: string };

export function useUsersList() {
  return useQuery({
    queryKey: queryKeys.usersList(),
    queryFn: () => apiFetcher<UserOption[]>("/api/users/list"),
  });
}
