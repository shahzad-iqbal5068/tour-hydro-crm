import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StarBooking } from "@/models/StarBooking";

type Context = {
  params: Promise<{ id: string }>;
};

/**
 * PUT /api/star-bookings/:id/followup
 * Mark follow-up as done (followUpSent: true). Optional body: { followUpNote }.
 */
export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const followUpNote = body.followUpNote;

    await connectToDatabase();

    const update: Record<string, unknown> = { followUpSent: true };
    if (followUpNote !== undefined) {
      update.followUpNote = followUpNote;
    }

    const updated = await StarBooking.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error marking follow-up done:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
