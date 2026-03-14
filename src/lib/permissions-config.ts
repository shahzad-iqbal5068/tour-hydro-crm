import type { Role } from "@/types";

/**
 * Permission constants. Safe to use in client and server.
 * Use in UI: hasPermission(user.role, Permission.MANAGE_USERS) to show/hide Admin.
 */
export const Permission = {
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_INQUIRIES: "VIEW_INQUIRIES",
  CREATE_INQUIRY: "CREATE_INQUIRY",
  EDIT_INQUIRY: "EDIT_INQUIRY",
  DELETE_INQUIRY: "DELETE_INQUIRY",
  VIEW_BOOKINGS: "VIEW_BOOKINGS",
  MANAGE_BOOKINGS: "MANAGE_BOOKINGS",
  VIEW_OWN_ATTENDANCE: "VIEW_OWN_ATTENDANCE",
  MANAGE_OWN_ATTENDANCE: "MANAGE_OWN_ATTENDANCE",
  VIEW_ALL_ATTENDANCE: "VIEW_ALL_ATTENDANCE",
  MANAGE_USERS: "MANAGE_USERS",
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

/** Roles allowed for each permission. Change here to update both API and UI. */
export const ROLE_PERMISSIONS: Record<PermissionKey, Role[]> = {
  [Permission.VIEW_DASHBOARD]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.VIEW_INQUIRIES]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.CREATE_INQUIRY]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.EDIT_INQUIRY]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.DELETE_INQUIRY]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.VIEW_BOOKINGS]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.MANAGE_BOOKINGS]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.VIEW_OWN_ATTENDANCE]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.MANAGE_OWN_ATTENDANCE]: [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "CEO",
    "SALES_EXEC",
    "CALL_PERSON",
  ],
  [Permission.VIEW_ALL_ATTENDANCE]: ["SUPER_ADMIN", "ADMIN", "MANAGER", "CEO"],
  [Permission.MANAGE_USERS]: ["SUPER_ADMIN", "ADMIN"],
};

export function hasPermission(role: string, permission: PermissionKey): boolean {
  const allowed = ROLE_PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(role as Role);
}
