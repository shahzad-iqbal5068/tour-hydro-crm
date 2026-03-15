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

function parseBool(v: unknown): boolean {
  if (v === true || v === "true" || v === "1") return true;
  return false;
}

const VALID_WHATSAPP = ["WA-1", "WA-2", "WA-3", "WA-4"] as const;
const VALID_LOCATIONS = ["Canal", "Marina", "Creek", "Yacht"] as const;
const VALID_STATUSES = [
  "New Inquiry",
  "Follow-Up Pending",
  "Follow-Up Done",
  "Waiting for Customer",
  "Confirmed",
  "Cancelled",
  "No Reply",
  "Lost",
] as const;
const VALID_VISIT = [
  "Visit Completed",
  "Customer Visit Scheduled",
  "Visit Today",
  "Visit Tomorrow",
  "On The Way",
  "No Visit",
] as const;
const VALID_REMINDER = [
  "Done",
  "Today",
  "Overdue",
  "Due in 15 min",
  "Upcoming",
  "Visit Today",
  "Visit Tomorrow",
  "Visit Scheduled",
  "Customer Coming",
  "No Visit",
  "On The Way",
] as const;
const VALID_PRIORITY = ["High", "Medium", "Low"] as const;
const VALID_POPUP = ["Pending", "Done"] as const;

function str<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
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
    const phone = String(body.phone ?? "").trim();
    if (!customerName || !phone) {
      return NextResponse.json(
        { message: "customerName and phone are required" },
        { status: 400 }
      );
    }

    const travelDate = parseDate(body.travelDate);
    if (!travelDate) {
      return NextResponse.json(
        { message: "Valid travelDate is required" },
        { status: 400 }
      );
    }

    const dateAdded = parseDate(body.dateAdded);

    const doc = await GroupDashboardLead.create({
      dateAdded: dateAdded ?? new Date(),
      whatsapp,
      customerName,
      phone,
      groupSize: parseNum(body.groupSize),
      location,
      travelDate,
      bookingStatus,
      lastFollowUpDate: parseDate(body.lastFollowUpDate),
      nextFollowUpDate: parseDate(body.nextFollowUpDate),
      nextFollowUpTime: body.nextFollowUpTime ? String(body.nextFollowUpTime).trim() : undefined,
      followUpPriority: str(body.followUpPriority, VALID_PRIORITY),
      assignedAgent: body.assignedAgent ? String(body.assignedAgent).trim() : undefined,
      updatedByEmail: body.updatedByEmail ? String(body.updatedByEmail).trim() : undefined,
      reminderDone: parseBool(body.reminderDone),
      reminderTriggered: parseBool(body.reminderTriggered),
      popupAlertStatus: str(body.popupAlertStatus, VALID_POPUP),
      reminderVisitStatus: str(body.reminderVisitStatus, VALID_REMINDER),
      visitStatus: str(body.visitStatus, VALID_VISIT),
      notes: body.notes ? String(body.notes).trim() : undefined,
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
      const dateAdded = (d.dateAdded as Date | undefined) ?? createdAt;
      const lastFollowUp = d.lastFollowUpDate as Date | undefined;
      const nextFollowUp = d.nextFollowUpDate as Date | undefined;
      const travel = d.travelDate as Date | undefined;
      return {
        _id: d._id?.toString(),
        dateAdded: dateAdded ? formatDate(dateAdded as Date) : undefined,
        whatsapp: d.whatsapp,
        customerName: d.customerName,
        phone: d.phone,
        groupSize: d.groupSize,
        location: d.location,
        travelDate: travel ? formatDate(travel as Date) : undefined,
        bookingStatus: d.bookingStatus,
        lastFollowUpDate: lastFollowUp ? formatDate(lastFollowUp as Date) : undefined,
        nextFollowUpDate: nextFollowUp ? formatDate(nextFollowUp as Date) : undefined,
        nextFollowUpTime: d.nextFollowUpTime,
        followUpPriority: d.followUpPriority,
        assignedAgent: d.assignedAgent,
        updatedByEmail: d.updatedByEmail,
        updateTimestamp: updatedAt ? formatDateTime(updatedAt as Date) : undefined,
        reminderDone: d.reminderDone,
        reminderTriggered: d.reminderTriggered,
        popupAlertStatus: d.popupAlertStatus,
        reminderVisitStatus: d.reminderVisitStatus,
        visitStatus: d.visitStatus,
        visitReminderStatus: d.reminderVisitStatus,
        notes: d.notes,
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
