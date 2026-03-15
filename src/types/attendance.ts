/**
 * Attendance types.
 */

import type { Role } from "./user";

export type AttendanceRow = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  date: string; // ISO date (yyyy-mm-dd)
  checkInAt?: string; // ISO datetime
  checkOutAt?: string; // ISO datetime
  location?: string;
  photoUrl?: string;
};
