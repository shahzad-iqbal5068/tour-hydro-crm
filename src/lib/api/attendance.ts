import { apiFetcher, apiMutation } from "./client";
import type {
  AttendanceMineResponse,
  AttendanceHistoryItem,
  AttendanceRow,
  AttendanceListParams,
} from "@/types/attendance";

export async function fetchAttendanceMine(): Promise<AttendanceMineResponse> {
  return apiFetcher<AttendanceMineResponse>("/api/attendance/mine");
}

export async function fetchAttendanceMineHistory(
  limit = 30
): Promise<AttendanceHistoryItem[]> {
  const res = await apiFetcher<{ data: AttendanceHistoryItem[] }>(
    `/api/attendance/mine/history?limit=${limit}`
  );
  return res.data ?? [];
}

export async function fetchAttendanceList(
  params: AttendanceListParams
): Promise<AttendanceRow[]> {
  const search = new URLSearchParams();
  if (params.date) search.set("date", params.date);
  if (params.month != null) search.set("month", String(params.month));
  if (params.year != null) search.set("year", String(params.year));
  if (params.role && params.role !== "ALL") search.set("role", params.role);
  const res = await apiFetcher<{ data: AttendanceRow[] }>(
    `/api/attendance?${search.toString()}`
  );
  return res.data ?? [];
}

type AttendanceStartBody = { location?: string; photoUrl: string };
type AttendanceEndBody = { location?: string; photoUrl?: string };

export async function attendanceStart(
  body: AttendanceStartBody
): Promise<{ _id: string; checkInAt: string; location?: string; photoUrl?: string }> {
  return apiMutation("/api/attendance/start", "POST", body) as Promise<
    { _id: string; checkInAt: string; location?: string; photoUrl?: string }
  >;
}

export async function attendanceEnd(
  body: AttendanceEndBody
): Promise<{
  _id: string;
  checkInAt: string;
  checkOutAt: string;
  location?: string;
  photoUrl?: string;
}> {
  return apiMutation("/api/attendance/end", "POST", body) as Promise<{
    _id: string;
    checkInAt: string;
    checkOutAt: string;
    location?: string;
    photoUrl?: string;
  }>;
}
