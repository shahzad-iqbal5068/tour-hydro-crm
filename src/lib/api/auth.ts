import { apiMutation } from "./client";
import type { LoginValues } from "@/types/auth";
import type { AuthUser } from "@/types/user";

export async function authLogin(body: LoginValues): Promise<{ token?: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { message?: string }).message ?? "Login failed";
    throw new Error(msg);
  }
  return data as { token?: string };
}

export async function authLogout(): Promise<void> {
  await apiMutation("/api/auth/logout", "POST");
}

export async function authGetMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  const data = (await res.json().catch(() => ({}))) as { user?: AuthUser };
  return data?.user ?? null;
}
