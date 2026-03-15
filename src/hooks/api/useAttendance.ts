"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAttendanceMine,
  fetchAttendanceMineHistory,
  fetchAttendanceList,
} from "@/lib/api";
import type { AttendanceListParams } from "@/types/attendance";
import { queryKeys } from "./queryKeys";
import { DEFAULT_STALE_MS, normalizeQueryError, SHORT_STALE_MS } from "./queryHelpers";

export function useAttendanceMine() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.attendanceMine(),
    queryFn: fetchAttendanceMine,
    staleTime: SHORT_STALE_MS,
  });

  return {
    status: data?.status ?? "none",
    record: data?.record ?? null,
    isLoading,
    error: normalizeQueryError(error),
    refetch,
  };
}

export function useAttendanceMineHistory(limit = 30) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.attendanceMineHistory(limit),
    queryFn: () => fetchAttendanceMineHistory(limit),
    staleTime: DEFAULT_STALE_MS,
  });

  return {
    data: data ?? [],
    isLoading,
    error: normalizeQueryError(error),
    refetch,
  };
}

export function useInvalidateAttendance() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.attendanceMine() });
    queryClient.invalidateQueries({ queryKey: queryKeys.attendanceMineHistory() });
  };
}

export function useAttendanceList(params: AttendanceListParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.attendanceList(params),
    queryFn: () => fetchAttendanceList(params),
    staleTime: DEFAULT_STALE_MS,
  });

  return {
    data: data ?? [],
    isLoading,
    error: normalizeQueryError(error),
    refetch,
  };
}
