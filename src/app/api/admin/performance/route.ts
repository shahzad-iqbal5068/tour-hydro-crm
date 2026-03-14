import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";
import { StarBooking } from "@/models/StarBooking";
import { User } from "@/models/User";
import { requireAuth } from "@/lib/permissions";

type Range = "daily" | "weekly" | "monthly" | "yearly";

function getDateRange(range: Range): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);

  switch (range) {
    case "daily":
      start.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "yearly":
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(0);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setHours(0, 0, 0, 0);
  }
  return { start, end };
}

/**
 * GET /api/admin/performance?range=daily|weekly|monthly|yearly
 * Returns overview, per-employee table, time series, and leaderboard.
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "daily") as Range;
    if (!["daily", "weekly", "monthly", "yearly"].includes(range)) {
      return NextResponse.json(
        { message: "Invalid range. Use daily, weekly, monthly, or yearly." },
        { status: 400 }
      );
    }

    const { start, end } = getDateRange(range);

    await connectToDatabase();

    const dateFilter = { date: { $gte: start, $lte: end } };
    const bookingDateFilter = { createdAt: { $gte: start, $lte: end } };

    const [inquiryAgg, bookingAgg, users] = await Promise.all([
      Inquiry.aggregate<{ _id: string | null; totalInquiries: number }>([
        { $match: dateFilter },
        { $group: { _id: "$userId", totalInquiries: { $sum: 1 } } },
      ]),
      StarBooking.aggregate<{ _id: string | null; totalBookings: number }>([
        { $match: bookingDateFilter },
        { $group: { _id: "$userId", totalBookings: { $sum: 1 } } },
      ]),
      User.find().select("_id name").lean(),
    ]);

    const userMap = new Map(
      users.map((u) => [u._id.toString(), u.name as string])
    );

    const inquiryByUser = new Map<string, number>();
    inquiryAgg.forEach((r) => {
      const id = r._id ? String(r._id) : "unassigned";
      inquiryByUser.set(id, r.totalInquiries);
    });
    const bookingByUser = new Map<string, number>();
    bookingAgg.forEach((r) => {
      const id = r._id ? String(r._id) : "unassigned";
      bookingByUser.set(id, r.totalBookings);
    });

    const allUserIds = new Set([
      ...inquiryByUser.keys(),
      ...bookingByUser.keys(),
    ]);
    allUserIds.delete("unassigned");

    const employees: { userId: string; name: string; inquiries: number; bookings: number; conversionRate: number }[] = [];
    let totalInquiries = 0;
    let totalBookings = 0;

    allUserIds.forEach((userId) => {
      const inquiries = inquiryByUser.get(userId) ?? 0;
      const bookings = bookingByUser.get(userId) ?? 0;
      totalInquiries += inquiries;
      totalBookings += bookings;
      const conversionRate = inquiries > 0 ? Math.round((bookings / inquiries) * 100) : 0;
      employees.push({
        userId,
        name: userMap.get(userId) ?? "Unknown",
        inquiries,
        bookings,
        conversionRate,
      });
    });

    const unassignedInq = inquiryByUser.get("unassigned") ?? 0;
    const unassignedBook = bookingByUser.get("unassigned") ?? 0;
    totalInquiries += unassignedInq;
    totalBookings += unassignedBook;
    if (unassignedInq > 0 || unassignedBook > 0) {
      employees.push({
        userId: "unassigned",
        name: "Unassigned",
        inquiries: unassignedInq,
        bookings: unassignedBook,
        conversionRate: unassignedInq > 0 ? Math.round((unassignedBook / unassignedInq) * 100) : 0,
      });
    }

    employees.sort((a, b) => b.inquiries - a.inquiries);

    const conversionRate = totalInquiries > 0 ? Math.round((totalBookings / totalInquiries) * 100) : 0;
    const topEmployee = employees.length > 0
      ? employees.reduce((best, cur) => (cur.bookings > best.bookings ? cur : best))
      : null;

    const leaderboard = [...employees]
      .filter((e) => e.userId !== "unassigned")
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10);

    const timeSeries = await getTimeSeries(range, start, end);

    return NextResponse.json({
      range,
      start: start.toISOString(),
      end: end.toISOString(),
      overview: {
        totalInquiries,
        totalBookings,
        conversionRate,
        topEmployee: topEmployee ? { name: topEmployee.name, bookings: topEmployee.bookings } : null,
      },
      employees,
      leaderboard,
      timeSeries,
    });
  } catch (error) {
    console.error("Error fetching performance:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

async function getTimeSeries(
  range: Range,
  start: Date,
  end: Date
): Promise<{ label: string; inquiries: number; bookings: number }[]> {
  const format = range === "daily" ? "day" : range === "weekly" ? "week" : range === "monthly" ? "month" : "year";
  const groupId: Record<string, unknown> =
    format === "day"
      ? { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
      : format === "week"
      ? { $dateToString: { format: "%Y-W%V", date: "$date" } }
      : format === "month"
      ? { $dateToString: { format: "%Y-%m", date: "$date" } }
      : { $dateToString: { format: "%Y", date: "$date" } };

  const inquirySeries = await Inquiry.aggregate<{ _id: string; count: number }>([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: groupId, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const bookingGroupId =
    format === "day"
      ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
      : format === "week"
      ? { $dateToString: { format: "%Y-W%V", date: "$createdAt" } }
      : format === "month"
      ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
      : { $dateToString: { format: "%Y", date: "$createdAt" } };

  const bookingSeries = await StarBooking.aggregate<{ _id: string; count: number }>([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $group: { _id: bookingGroupId, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const labels = new Set([
    ...inquirySeries.map((s) => s._id),
    ...bookingSeries.map((s) => s._id),
  ]);
  const inquiryMap = new Map(inquirySeries.map((s) => [s._id, s.count]));
  const bookingMap = new Map(bookingSeries.map((s) => [s._id, s.count]));

  return Array.from(labels)
    .sort()
    .map((label) => ({
      label,
      inquiries: inquiryMap.get(label) ?? 0,
      bookings: bookingMap.get(label) ?? 0,
    }));
}
