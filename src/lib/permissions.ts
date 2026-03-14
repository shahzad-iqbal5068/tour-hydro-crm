import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  Permission,
  hasPermission,
  type PermissionKey,
} from "@/lib/permissions-config";
import { verifyToken } from "@/lib/auth";

export { Permission, hasPermission, type PermissionKey };

/**
 * Get auth token from request cookies and verify. Returns JWT user or null.
 * Server-only (uses next/headers).
 */
export async function getAuthUser(): Promise<{
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Require the current request to be authenticated and have the given permission.
 * Use at the start of an API route:
 *
 *   const auth = await requirePermission(Permission.MANAGE_USERS);
 *   if (!auth.ok) return auth.response;
 *   const user = auth.user;
 */
export async function requirePermission(permission: PermissionKey): Promise<
  | { ok: true; user: { id: string; email: string; name: string; role: string; avatarUrl?: string } }
  | { ok: false; response: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!hasPermission(user.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Forbidden: you do not have permission for this action" },
        { status: 403 }
      ),
    };
  }
  return { ok: true, user };
}

/**
 * Require the current request to be authenticated (any role).
 * Use for routes that only need a logged-in user.
 */
export async function requireAuth(): Promise<
  | { ok: true; user: { id: string; email: string; name: string; role: string; avatarUrl?: string } }
  | { ok: false; response: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, user };
}
