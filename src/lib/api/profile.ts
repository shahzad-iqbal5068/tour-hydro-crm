import { apiMutation } from "./client";

export async function profileUpdate(body: {
  avatarUrl: string;
}): Promise<{ avatarUrl: string }> {
  return apiMutation<{ avatarUrl: string }>("/api/profile", "PUT", body);
}
