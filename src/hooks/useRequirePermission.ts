"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasPermission, type PermissionKey } from "@/lib/permissions-config";
import { authGetMe } from "@/lib/api";

/**
 * On mount, fetches current user and redirects to / if they don't have the required permission.
 * Use on admin-only pages (e.g. Admin Users, Admin Attendance).
 */
export function useRequirePermission(permission: PermissionKey): {
  allowed: boolean;
  loading: boolean;
} {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const user = await authGetMe();
        if (cancelled) return;
        if (user?.role && hasPermission(user.role, permission)) {
          setAllowed(true);
        } else {
          router.replace("/");
        }
      } catch {
        if (!cancelled) router.replace("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [permission, router]);

  return { allowed, loading };
}
