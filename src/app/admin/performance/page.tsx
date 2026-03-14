import type { Metadata } from "next";
import PerformanceClient from "./PerformanceClient";

export const metadata: Metadata = {
  title: "Performance Dashboard | Tour Hydro CRM",
  description: "Admin performance dashboard: inquiries, bookings, conversion rate, employee comparison and leaderboard.",
};

export default function PerformancePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PerformanceClient />
    </div>
  );
}
