import { daysUntil } from "./daysUtils";

type HasFollowUpFields = {
  bookingStatus?: string;
  confirmBookingDate?: string;
};

export default function getUpcomingFollowUps<T extends HasFollowUpFields>(
  rows: T[]
): T[] {
  return rows.filter((r) => {
    if (r.bookingStatus?.toLowerCase() === "done") return false;

    const d = daysUntil(r.confirmBookingDate ?? "");
    return d !== null && d >= 0 && d <= 3;
  });
}