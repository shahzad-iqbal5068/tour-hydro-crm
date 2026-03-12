export type SectionKey = "dashboard" | "inqueries" | "admin";

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

export type InquiryRow = {
  _id: string;
  date: string;
  shift: string;
  whatsappName: string;
  remarks?: string;
};

export type InquiryFormValues = {
  date: string;
  shift: string;
  whatsappName: string;
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

