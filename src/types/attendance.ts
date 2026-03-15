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

/** Response from GET /api/attendance/mine */
export type AttendanceMineResponse = {
  status: "none" | "checked_in" | "closed";
  record?: AttendanceMineRecord;
};

export type AttendanceMineRecord = {
  _id: string;
  checkInAt?: string;
  checkOutAt?: string;
  location?: string;
  photoUrl?: string;
};

/** Item in GET /api/attendance/mine/history response data array */
export type AttendanceHistoryItem = {
  _id: string;
  date: string;
  checkInAt?: string;
  checkOutAt?: string;
  location?: string;
  photoUrl?: string;
};

/** Params for GET /api/attendance (admin list) */
export type AttendanceListParams = {
  date?: string;
  month?: number;
  year?: number;
  role?: string;
};
