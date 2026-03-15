/**
 * User and role types (admin, profile, users list).
 */

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "CEO"
  | "SALES_EXEC"
  | "CALL_PERSON";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  avatarUrl?: string;
};
