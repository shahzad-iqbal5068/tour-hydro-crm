/**
 * Admin dashboard and performance types.
 */

export type PerformanceRange = "daily" | "weekly" | "monthly" | "yearly";

export type PerformanceData = {
  range: PerformanceRange;
  start: string;
  end: string;
  overview: {
    totalInquiries: number;
    totalBookings: number;
    conversionRate: number;
    topEmployee: { name: string; bookings: number } | null;
  };
  employees: {
    userId: string;
    name: string;
    inquiries: number;
    bookings: number;
    conversionRate: number;
  }[];
  leaderboard: {
    userId: string;
    name: string;
    inquiries: number;
    bookings: number;
    conversionRate: number;
  }[];
  timeSeries: { label: string; inquiries: number; bookings: number }[];
};
