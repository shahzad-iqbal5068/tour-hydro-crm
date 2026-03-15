import { apiFetcher, apiMutation } from "./client";
import type { UserRow } from "@/types/user";
import type { PerformanceData } from "@/types/admin";

export async function fetchAdminUsers(): Promise<UserRow[]> {
  const data = await apiFetcher<UserRow[] | { data?: UserRow[] }>("/api/admin/users");
  if (Array.isArray(data)) return data;
  return (data as { data?: UserRow[] }).data ?? [];
}

type AdminUserPayload = {
  id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
};

export async function saveAdminUser(
  payload: AdminUserPayload
): Promise<UserRow | { message: string }> {
  return apiMutation<UserRow | { message: string }>("/api/admin/users", "POST", payload);
}

export async function fetchPerformance(range: string): Promise<PerformanceData> {
  return apiFetcher<PerformanceData>(
    `/api/admin/performance?range=${encodeURIComponent(range)}`
  );
}
