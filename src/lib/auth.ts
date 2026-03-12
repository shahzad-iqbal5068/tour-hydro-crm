import jwt from "jsonwebtoken";
import type { IUser } from "@/models/User";

const SUPER_ADMIN_EMAIL = "choudhuryshahzad5068@gmail.com";

export type JwtUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
};

function getJwtSecret(): string {
  // Fallback to a development secret if not provided
  return process.env.JWT_SECRET as string ;
}

export function signUser(user: IUser): string {
  const payload: JwtUser = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };

  const secret = process.env.JWT_SECRET || "dev-jwt-secret-change-me";

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtUser | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtUser;
  } catch {
    return null;
  }
}

export function isSuperAdmin(user: JwtUser | null): boolean {
  return !!user && user.role === "SUPER_ADMIN" && user.email === SUPER_ADMIN_EMAIL;
}

