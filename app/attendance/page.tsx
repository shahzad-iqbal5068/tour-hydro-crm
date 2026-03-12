import type { Metadata } from "next";
import AttendanceClient from "./AttendanceClient";

export const metadata: Metadata = {
  title: "Attendance | Hydro CRM",
  description:
    "Mark daily attendance with location and photo for Hydro CRM staff.",
};

export default function AttendancePage() {
  return <AttendanceClient />;
}

