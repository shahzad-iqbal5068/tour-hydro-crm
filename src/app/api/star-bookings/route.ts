import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StarBooking } from "@/models/StarBooking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      time,
      pax,
      guestName,
      phone,
      collectionAmount = body.collection,
      paid,
      balance,
      deck,
      remarks,
      callingRemarks,
    } = body;

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
      collectionAmount: Number(collectionAmount) ?? 0,
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

    if (!category || !["4-5", "3"].includes(category)) {
      return NextResponse.json(
        { message: "Valid category (4-5 or 3) query param is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const bookings = await StarBooking.find({ category })
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

