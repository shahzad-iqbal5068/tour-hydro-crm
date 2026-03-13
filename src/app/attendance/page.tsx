import type { Metadata } from "next";
import AttendanceClient from "@/components/attendance/AttendanceClient";

export const metadata: Metadata = {
  title: "My Attendance | Hydro CRM",
  description:
    "Mark your own attendance with photo and location, and review your recent records.",
};

export default function AttendancePage() {
  return <AttendanceClient />;
}

