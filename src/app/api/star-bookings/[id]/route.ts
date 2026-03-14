import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StarBooking } from "@/models/StarBooking";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    await connectToDatabase();
    const booking = await StarBooking.findById(id).lean();

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Error fetching star booking:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const category = body.category;
    const time = body.time;
    const pax = body.pax;
    const guestName = body.guestName;
    const phone = body.phone;
    const paid = body.paid;
    const balance = body.balance;
    const deck = body.deck;
    const remarks = body.remarks;
    const callingRemarks = body.callingRemarks;
    const collectionAmount = Number(
      body.collectionAmount ?? body.collection ?? 0
    );
    const amount = Number.isNaN(collectionAmount) ? 0 : collectionAmount;

    await connectToDatabase();

    const update: Record<string, unknown> = {
      time,
      pax,
      guestName,
      phone,
      collectionAmount: amount,
      paid,
      balance,
      deck,
      remarks,
      callingRemarks,
    };
    if (category && ["4-5", "3"].includes(category)) {
      update.category = category;
    }

    const updated = await StarBooking.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating star booking:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    await connectToDatabase();

    const deleted = await StarBooking.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Booking deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting star booking:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

