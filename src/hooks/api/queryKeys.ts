/**
 * Centralized query keys for TanStack Query.
 * Use with queryClient.invalidateQueries({ queryKey: keys.inquiries() }) etc.
 */
export const queryKeys = {
  inquiries: () => ["inquiries"] as const,
  inquiry: (id: string | null) => ["inquiries", id] as const,
  starBookings: (category?: string) =>
    category ? (["star-bookings", category] as const) : (["star-bookings"] as const),
  followups: (date: string, category?: string) =>
    category ? (["followups", date, category] as const) : (["followups", date] as const),
  followupsToday: () => ["followups", "today"] as const,
  dashboardStats: (period: string) => ["dashboard", "stats", period] as const,
  usersList: () => ["users", "list"] as const,
};
