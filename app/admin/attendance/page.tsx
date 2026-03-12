import type { Metadata } from "next";
import AdminAttendanceClient from "./AdminAttendanceClient";

export const metadata: Metadata = {
  title: "Admin Attendance | Hydro CRM",
  description:
    "View attendance times, locations and photos for all Hydro CRM roles.",
};

export default function AdminAttendancePage() {
  return <AdminAttendanceClient />;
}

