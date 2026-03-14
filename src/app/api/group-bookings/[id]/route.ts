import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GroupBooking } from "@/models/GroupBooking";

type Context = { params: Promise<{ id: string }> };

function parseNum(v: unknown): number {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function parseDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    const doc = await GroupBooking.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ message: "Group booking not found" }, { status: 404 });
    }
    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error("Error fetching group booking:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Internal server error", error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    await connectToDatabase();

    const update: Record<string, unknown> = {
      groupBookingName: body.groupBookingName !== undefined ? String(body.groupBookingName ?? "").trim() || "—" : undefined,
      guestName: body.guestName !== undefined ? String(body.guestName ?? "").trim() || "—" : undefined,
      contactWhatsapp: body.contactWhatsapp !== undefined ? String(body.contactWhatsapp ?? "").trim() : undefined,
      groupsCount: body.groupsCount !== undefined ? parseNum(body.groupsCount) || 1 : undefined,
      cruiseName: body.cruiseName !== undefined ? String(body.cruiseName ?? "").trim() : undefined,
      numberOfPax: body.numberOfPax !== undefined ? parseNum(body.numberOfPax) : undefined,
      timeSlot: body.timeSlot !== undefined ? String(body.timeSlot ?? "").trim() : undefined,
      inquiryDate: body.inquiryDate !== undefined ? parseDate(body.inquiryDate) : undefined,
      confirmDate: body.confirmDate !== undefined ? parseDate(body.confirmDate) : undefined,
      bookingStatusRemarks: body.bookingStatusRemarks !== undefined ? (body.bookingStatusRemarks ? String(body.bookingStatusRemarks).trim() : null) : undefined,
      totalAmount: body.totalAmount !== undefined ? parseNum(body.totalAmount) : undefined,
      advancePaid: body.advancePaid !== undefined ? parseNum(body.advancePaid) : undefined,
      remainingAmount: body.remainingAmount !== undefined ? parseNum(body.remainingAmount) : undefined,
      callingDate: body.callingDate !== undefined ? parseDate(body.callingDate) : undefined,
      remarks: body.remarks !== undefined ? (body.remarks ? String(body.remarks).trim() : null) : undefined,
    };

    const filtered = Object.fromEntries(
      Object.entries(update).filter(([, v]) => v !== undefined)
    ) as Record<string, unknown>;

    const updated = await GroupBooking.findByIdAndUpdate(id, filtered, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ message: "Group booking not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating group booking:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Internal server error", error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    const deleted = await GroupBooking.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ message: "Group booking not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Group booking deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting group booking:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Internal server error", error: message }, { status: 500 });
  }
}
