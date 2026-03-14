import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StarBooking } from "@/models/StarBooking";

/**
 * GET /api/followups?date=YYYY-MM-DD
 * Returns bookings with followUpDate on the given date (default: today) and followUpSent false.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    let start: Date;
    if (dateParam) {
      start = new Date(dateParam + "T00:00:00.000Z");
      if (Number.isNaN(start.getTime())) {
        return NextResponse.json(
          { message: "Invalid date format. Use YYYY-MM-DD." },
          { status: 400 }
        );
      }
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    }

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    await connectToDatabase();

    const bookings = await StarBooking.find({
      followUpDate: { $gte: start, $lt: end },
      followUpSent: { $ne: true },
    })
      .sort({ followUpDate: 1, time: 1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
