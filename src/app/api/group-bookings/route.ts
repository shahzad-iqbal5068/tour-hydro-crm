import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GroupBooking } from "@/models/GroupBooking";

function parseNum(v: unknown): number {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function parseDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const doc = await GroupBooking.create({
      groupBookingName: String(body.groupBookingName ?? "").trim() || "—",
      guestName: String(body.guestName ?? "").trim() || "—",
      contactWhatsapp: String(body.contactWhatsapp ?? "").trim(),
      groupsCount: parseNum(body.groupsCount) || 1,
      cruiseName: String(body.cruiseName ?? "").trim(),
      numberOfPax: parseNum(body.numberOfPax),
      timeSlot: String(body.timeSlot ?? "").trim(),
      inquiryDate: parseDate(body.inquiryDate),
      confirmDate: parseDate(body.confirmDate),
      bookingStatusRemarks: body.bookingStatusRemarks ? String(body.bookingStatusRemarks).trim() : undefined,
      totalAmount: parseNum(body.totalAmount),
      advancePaid: parseNum(body.advancePaid),
      remainingAmount: parseNum(body.remainingAmount),
      callingDate: parseDate(body.callingDate),
      remarks: body.remarks ? String(body.remarks).trim() : undefined,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Error creating group booking:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const list = await GroupBooking.find({})
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ data: list }, { status: 200 });
  } catch (error) {
    console.error("Error fetching group bookings:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
