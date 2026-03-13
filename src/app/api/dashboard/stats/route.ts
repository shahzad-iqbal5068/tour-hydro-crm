import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";
import { StarBooking } from "@/models/StarBooking";

type Period = "today" | "weekly" | "monthly" | "yearly";

function getDateRange(period: Period): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);

  switch (period) {
    case "today": {
      start.setUTCHours(0, 0, 0, 0);
      return { start, end };
    }
    case "weekly": {
      start.setDate(start.getDate() - 7);
      return { start, end };
    }
    case "monthly": {
      start.setDate(start.getDate() - 30);
      return { start, end };
    }
    case "yearly": {
      start.setDate(start.getDate() - 365);
      return { start, end };
    }
    default:
      start.setUTCHours(0, 0, 0, 0);
      return { start, end };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "today") as Period;

    if (!["today", "weekly", "monthly", "yearly"].includes(period)) {
      return NextResponse.json(
        { message: "Invalid period. Use today, weekly, monthly or yearly" },
        { status: 400 }
      );
    }

    const { start, end } = getDateRange(period);

    await connectToDatabase();

    const dateRange = { createdAt: { $gte: start, $lte: end } };

    const [inquiries, bookings4to5, bookings3] = await Promise.all([
      Inquiry.countDocuments({
        date: { $gte: start, $lte: end },
      }),
      StarBooking.countDocuments({ ...dateRange, category: "4-5" }),
      StarBooking.countDocuments({ ...dateRange, category: "3" }),
    ]);

    const bookingsTotal = bookings4to5 + bookings3;

    return NextResponse.json(
      { inquiries, bookings4to5, bookings3, bookingsTotal, period },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
