import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StarBooking } from "@/models/StarBooking";

export async function POST(request: NextRequest) {
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

    if (!category || !["4-5", "3"].includes(category)) {
      return NextResponse.json(
        { message: "Valid category (4-5 or 3) is required" },
        { status: 400 }
      );
    }

    if (!time || !pax || !guestName || !phone) {
      return NextResponse.json(
        { message: "Time, pax, guest name and phone are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const booking = await StarBooking.create({
      category,
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
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating star booking:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    await connectToDatabase();

    const query = category && ["4-5", "3"].includes(category)
      ? { category }
      : {};

    const bookings = await StarBooking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching star bookings:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

