import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StarBooking } from "@/models/StarBooking";

/**
 * GET /api/followups/today
 * Returns bookings with followUpDate today and followUpSent false.
 */
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await connectToDatabase();

    const bookings = await StarBooking.find({
      followUpDate: { $gte: today, $lt: tomorrow },
      followUpSent: { $ne: true },
    })
      .sort({ followUpDate: 1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching today follow-ups:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
