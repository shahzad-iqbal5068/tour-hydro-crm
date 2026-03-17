import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AgentBooking } from "@/models/AgentBooking";

function parseNumber(v: unknown): number {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function parseDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET() {
  try {
    await connectToDatabase();
    const docs = await AgentBooking.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: docs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching agent bookings:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const customerName = String(body.customerName ?? "").trim();
    const contact = String(body.contact ?? "").trim();

    if (!customerName || !contact) {
      return NextResponse.json(
        { message: "customerName and contact are required" },
        { status: 400 }
      );
    }

    const doc = await AgentBooking.create({
      customerName,
      cruiseName: body.cruiseName ? String(body.cruiseName).trim() : undefined,
      pax: parseNumber(body.pax),
      contact,
      date: parseDate(body.date),
      time: body.time ? String(body.time).trim() : undefined,
      payment: body.payment ? String(body.payment).trim() : undefined,
      b2b: body.b2b ? String(body.b2b).trim() : undefined,
      htCommission: body.htCommission
        ? String(body.htCommission).trim()
        : undefined,
      agentCommission: body.agentCommission
        ? String(body.agentCommission).trim()
        : undefined,
      cameStatus:
        body.cameStatus === "came" ||
        body.cameStatus === "not_came" ||
        body.cameStatus === "custom"
          ? body.cameStatus
          : "came",
      cameCustomText: body.cameCustomText
        ? String(body.cameCustomText).trim()
        : undefined,
    });

    const lean = doc.toObject();
    return NextResponse.json(lean, { status: 201 });
  } catch (error) {
    console.error("Error creating agent booking:", error);
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

    if (body.customerName !== undefined) {
      update.customerName = String(body.customerName ?? "").trim();
    }
    if (body.contact !== undefined) {
      update.contact = String(body.contact ?? "").trim();
    }
    if (body.cruiseName !== undefined) {
      update.cruiseName = body.cruiseName
        ? String(body.cruiseName).trim()
        : undefined;
    }
    if (body.pax !== undefined) {
      update.pax = parseNumber(body.pax);
    }
    if (body.date !== undefined) {
      update.date = parseDate(body.date);
    }
    if (body.time !== undefined) {
      update.time = body.time ? String(body.time).trim() : undefined;
    }
    if (body.payment !== undefined) {
      update.payment = body.payment ? String(body.payment).trim() : undefined;
    }
    if (body.b2b !== undefined) {
      update.b2b = body.b2b ? String(body.b2b).trim() : undefined;
    }
    if (body.htCommission !== undefined) {
      update.htCommission = body.htCommission
        ? String(body.htCommission).trim()
        : undefined;
    }
    if (body.agentCommission !== undefined) {
      update.agentCommission = body.agentCommission
        ? String(body.agentCommission).trim()
        : undefined;
    }
    if (body.cameStatus !== undefined) {
      if (
        body.cameStatus !== "came" &&
        body.cameStatus !== "not_came" &&
        body.cameStatus !== "custom"
      ) {
        return NextResponse.json(
          { message: "Invalid cameStatus value" },
          { status: 400 }
        );
      }
      update.cameStatus = body.cameStatus;
    }
    if (body.cameCustomText !== undefined) {
      update.cameCustomText = body.cameCustomText
        ? String(body.cameCustomText).trim()
        : undefined;
    }

    const doc = await AgentBooking.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error("Error updating agent booking:", error);
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
    const result = await AgentBooking.findByIdAndDelete(id).lean();

    if (!result) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting agent booking:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

