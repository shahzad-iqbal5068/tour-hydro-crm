"use client";

import type { UseMutationResult } from "@tanstack/react-query";

/** Default stale time for list queries (1 min). */
export const DEFAULT_STALE_MS = 60 * 1000;
/** Shorter stale time for single-item/detail queries (30 s). */
export const SHORT_STALE_MS = 30 * 1000;
/** Longer stale time for rarely changing data (e.g. users list). */
export const FIVE_MIN_STALE_MS = 5 * 60 * 1000;

/** Normalize React Query error to Error | null for consistent hook return types. */
export function normalizeQueryError(error: unknown): Error | null {
  return error instanceof Error ? error : null;
}

/** Shape returned by our hooks for mutations (mutateAsync + isPending, optional variables). */
export type MutationResult<TData, TVariables, TError = Error> = {
  mutateAsync: UseMutationResult<TData, TError, TVariables>["mutateAsync"];
  isPending: boolean;
  variables?: TVariables;
};

/** Wrap useMutation result into the shape our hooks return (mutateAsync, isPending, optional variables). */
export function wrapMutationResult<TData, TVariables, TError = Error>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  options?: { includeVariables?: boolean }
): MutationResult<TData, TVariables, TError> {
  const base = {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
  if (options?.includeVariables && "variables" in mutation) {
    return { ...base, variables: mutation.variables as TVariables | undefined };
  }
  return base;
}
