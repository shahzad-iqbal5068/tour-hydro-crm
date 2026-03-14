"use client";

import { useEffect, useState } from "react";
import { apiFetcher } from "@/lib/api";

export type UserOption = { id: string; name: string };

export function useUsersList() {
  const [data, setData] = useState<UserOption[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- reset error before fetch */
    setError(null);
    apiFetcher<UserOption[]>("/api/users/list")
      .then((res) => {
        if (!cancelled) setData(Array.isArray(res) ? res : []);
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
  }, []);

  return { data: data ?? [], isLoading, error };
}
