export type SectionKey = "dashboard" | "bookings" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "CEO"
  | "SALES_EXEC"
  | "CALL_PERSON";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  avatarUrl?: string;
};

export type BookingRow = {
  _id: string;
  date: string;
  shift: string;
  name: string;
  email: string;
  whatsappPackage: string;
  remarks?: string;
};

export type BookingFormValues = {
  date: string;
  shift: string;
  name: string;
  email: string;
  package: string;
  remarks: string;
};

export type LoginValues = {
  email: string;
  password: string;
};

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

