import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { GroupDashboardLead } from "@/models/GroupDashboardLead";

function parseNum(v: unknown): number {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function parseDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const VALID_WHATSAPP = [
  "Fun Factory",
  "Fun & Fun",
  "Dhow Cruise (Ocean Leopard)",
  "Dubai Cruise Deals Wanderlust Wanderlust Adventures",
  "Blue world",
  "Dhow cruise trip",
  "Dubai Deals",
] as const;
const VALID_LOCATIONS = ["Canal", "Marina", "Creek", "Private yacht"] as const;
const VALID_STATUSES = ["Done", "Not done", "Custom"] as const;

function str<T extends string>(
  v: unknown,
  allowed: readonly T[]
): T | undefined {
  const s = typeof v === "string" ? v.trim() : "";
  return allowed.includes(s as T) ? (s as T) : undefined;
}

function formatDate(d: Date | undefined): string | undefined {
  if (!d) return undefined;
  return d.toISOString().slice(0, 10);
}

function formatDateTime(d: Date | undefined): string | undefined {
  if (!d) return undefined;
  return d.toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const whatsapp = str(body.whatsapp, VALID_WHATSAPP);
    const location = str(body.location, VALID_LOCATIONS);
    const bookingStatus = str(body.bookingStatus, VALID_STATUSES);

    if (!whatsapp || !location || !bookingStatus) {
      return NextResponse.json(
        { message: "whatsapp, location and bookingStatus are required" },
        { status: 400 }
      );
    }

    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.contact ?? body.phone ?? "").trim();
    if (!customerName || !phone) {
      return NextResponse.json(
        { message: "customerName and contact (phone) are required" },
        { status: 400 }
      );
    }

    const inquiryDate = parseDate(body.inquiryDate);
    const confirmBookingDate = parseDate(body.confirmBookingDate);

    const doc = await GroupDashboardLead.create({
      inquiryDate: inquiryDate ?? new Date(),
      dateAdded: inquiryDate ?? new Date(),
      whatsapp,
      assignedAgent: body.assignedAgent
        ? String(body.assignedAgent).trim()
        : undefined,
      confirmBookingDate: confirmBookingDate || undefined,
      customerName,
      phone,
      groupSize: parseNum(body.numberOfPersons ?? body.groupSize),
      location,
      travelDate: confirmBookingDate,
      bookingStatus,
      lastFollowUpDate: parseDate(body.lastFollowUpDate),
      cruiseName: body.cruiseName ? String(body.cruiseName).trim() : undefined,
      slotTiming: body.slotTiming ? String(body.slotTiming).trim() : undefined,
      groupNo: body.groupNo ? String(body.groupNo).trim() : undefined,
      remarks: body.remarks ? String(body.remarks).trim() : undefined,
      notes: body.remarks ? String(body.remarks).trim() : undefined,
      callingDate: parseDate(body.callingDate),
      totalAmount:
        body.totalAmount !== undefined && body.totalAmount !== ""
          ? parseNum(body.totalAmount)
          : undefined,
      advancePaid:
        body.advancePaid !== undefined && body.advancePaid !== ""
          ? parseNum(body.advancePaid)
          : undefined,
    });

    const lean = doc.toObject();
    return NextResponse.json(lean, { status: 201 });
  } catch (error) {
    console.error("Error creating group dashboard lead:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "id query parameter is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const update: Record<string, unknown> = {};

    if (body.whatsapp !== undefined) {
      const whatsapp = str(body.whatsapp, VALID_WHATSAPP);
      if (!whatsapp) {
        return NextResponse.json(
          { message: "Invalid whatsapp value" },
          { status: 400 }
        );
      }
      update.whatsapp = whatsapp;
    }

    if (body.location !== undefined) {
      const location = str(body.location, VALID_LOCATIONS);
      if (!location) {
        return NextResponse.json(
          { message: "Invalid location value" },
          { status: 400 }
        );
      }
      update.location = location;
    }

    if (body.bookingStatus !== undefined) {
      const bookingStatus = str(body.bookingStatus, VALID_STATUSES);
      if (!bookingStatus) {
        return NextResponse.json(
          { message: "Invalid bookingStatus value" },
          { status: 400 }
        );
      }
      update.bookingStatus = bookingStatus;
    }

    if (body.inquiryDate !== undefined) {
      update.inquiryDate = parseDate(body.inquiryDate);
    }
    if (body.confirmBookingDate !== undefined) {
      const confirm = parseDate(body.confirmBookingDate);
      update.confirmBookingDate = confirm;
      update.travelDate = confirm;
    }
    if (body.customerName !== undefined) {
      update.customerName = String(body.customerName ?? "").trim();
    }
    if (body.contact !== undefined || body.phone !== undefined) {
      const phone = String(body.contact ?? body.phone ?? "").trim();
      update.phone = phone || undefined;
    }
    if (body.numberOfPersons !== undefined || body.groupSize !== undefined) {
      update.groupSize = parseNum(body.numberOfPersons ?? body.groupSize);
    }
    if (body.assignedAgent !== undefined) {
      update.assignedAgent = body.assignedAgent
        ? String(body.assignedAgent).trim()
        : undefined;
    }
    if (body.lastFollowUpDate !== undefined) {
      update.lastFollowUpDate = parseDate(body.lastFollowUpDate);
    }
    if (body.cruiseName !== undefined) {
      update.cruiseName = body.cruiseName
        ? String(body.cruiseName).trim()
        : undefined;
    }
    if (body.slotTiming !== undefined) {
      update.slotTiming = body.slotTiming
        ? String(body.slotTiming).trim()
        : undefined;
    }
    if (body.groupNo !== undefined) {
      update.groupNo = body.groupNo ? String(body.groupNo).trim() : undefined;
    }
    if (body.remarks !== undefined) {
      const remarks = body.remarks ? String(body.remarks).trim() : undefined;
      update.remarks = remarks;
      update.notes = remarks;
    }
    if (body.callingDate !== undefined) {
      update.callingDate = parseDate(body.callingDate);
    }
    if (body.totalAmount !== undefined) {
      update.totalAmount =
        body.totalAmount !== "" && body.totalAmount !== null
          ? parseNum(body.totalAmount)
          : undefined;
    }
    if (body.advancePaid !== undefined) {
      update.advancePaid =
        body.advancePaid !== "" && body.advancePaid !== null
          ? parseNum(body.advancePaid)
          : undefined;
    }

    const doc = await GroupDashboardLead.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!doc) {
      return NextResponse.json(
        { message: "Group dashboard lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error("Error updating group dashboard lead:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "id query parameter is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deleted = await GroupDashboardLead.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Group dashboard lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Group dashboard lead deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting group dashboard lead:", error);
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
    const list = await GroupDashboardLead.find({})
      .sort({ createdAt: -1 })
      .lean();

    const data = list.map((doc) => {
      const d = doc as unknown as Record<string, unknown>;
      const createdAt = d.createdAt as Date | undefined;
      const updatedAt = d.updatedAt as Date | undefined;
      const inquiryDate = (d.inquiryDate as Date | undefined) ?? (d.dateAdded as Date | undefined) ?? createdAt;
      const dateAdded = (d.dateAdded as Date | undefined) ?? createdAt;
      const lastFollowUp = d.lastFollowUpDate as Date | undefined;
      const confirmBooking = d.confirmBookingDate as Date | undefined;
      const travel = (d.travelDate as Date | undefined) ?? confirmBooking;
      const calling = d.callingDate as Date | undefined;
      const totalAmount = d.totalAmount as number | undefined;
      const advancePaid = d.advancePaid as number | undefined;
      const remainingAmount =
        totalAmount != null && advancePaid != null
          ? totalAmount - advancePaid
          : undefined;
      return {
        _id: d._id?.toString(),
        inquiryDate: inquiryDate ? formatDate(inquiryDate as Date) : undefined,
        dateAdded: dateAdded ? formatDate(dateAdded as Date) : undefined,
        whatsapp: d.whatsapp,
        assignedAgent: d.assignedAgent,
        assignedPerson: d.assignedAgent,
        confirmBookingDate: confirmBooking
          ? formatDate(confirmBooking as Date)
          : undefined,
        customerName: d.customerName,
        phone: d.phone,
        contact: d.phone,
        groupSize: d.groupSize,
        numberOfPersons: d.groupSize,
        cruiseName: d.cruiseName,
        slotTiming: d.slotTiming,
        location: d.location,
        groupNo: d.groupNo,
        bookingStatus: d.bookingStatus,
        lastFollowUpDate: lastFollowUp
          ? formatDate(lastFollowUp as Date)
          : undefined,
        remarks: d.remarks ?? d.notes,
        notes: d.notes ?? d.remarks,
        callingDate: calling ? formatDate(calling as Date) : undefined,
        totalAmount: d.totalAmount,
        advancePaid: d.advancePaid,
        remainingAmount,
        updateTimestamp: updatedAt
          ? formatDateTime(updatedAt as Date)
          : undefined,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching group dashboard leads:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
