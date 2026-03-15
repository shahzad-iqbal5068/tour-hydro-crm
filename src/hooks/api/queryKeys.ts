/**
 * Centralized query keys for TanStack Query.
 * Use with queryClient.invalidateQueries({ queryKey: keys.inquiries() }) etc.
 */
export const queryKeys = {
  inquiries: () => ["inquiries"] as const,
  inquiry: (id: string | null) => ["inquiries", id] as const,
  starBookings: (category?: string) =>
    category ? (["star-bookings", category] as const) : (["star-bookings"] as const),
  groupBookings: () => ["group-bookings"] as const,
  groupDashboardLeads: () => ["group-dashboard-leads"] as const,
  followups: (date: string, category?: string) =>
    category ? (["followups", date, category] as const) : (["followups", date] as const),
  followupsToday: () => ["followups", "today"] as const,
  dashboardStats: (period: string) => ["dashboard", "stats", period] as const,
  usersList: () => ["users", "list"] as const,
  attendanceMine: () => ["attendance", "mine"] as const,
  attendanceMineHistory: (limit?: number) =>
    (["attendance", "mine", "history", limit] as const),
  attendanceList: (params: { date?: string; month?: number; year?: number; role?: string }) =>
    ["attendance", "list", params] as const,
  adminUsers: () => ["admin", "users"] as const,
  adminPerformance: (range: string) => ["admin", "performance", range] as const,
};
