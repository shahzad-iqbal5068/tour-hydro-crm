import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StarBooking } from "@/models/StarBooking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = body.category;
    const date = body.date ? new Date(body.date) : undefined;
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
    const followUpDate = body.followUpDate ? new Date(body.followUpDate) : undefined;
    const followUpNote = body.followUpNote ?? undefined;
    const userId = body.userId ?? undefined;

    const allowedCategories = ["4-5", "3", "heaven-on-sea", "boonmax-carnival", "rustar", "najom"];
    if (!category || typeof category !== "string" || !allowedCategories.includes(category.trim())) {
      return NextResponse.json(
        { message: "Valid category is required" },
        { status: 400 }
      );
    }
    const categoryValue = category.trim();

    if (!time || !pax || !guestName || !phone) {
      return NextResponse.json(
        { message: "Time, pax, guest name and phone are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const booking = await StarBooking.create({
      category: categoryValue,
      date,
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
      followUpDate,
      followUpNote,
      userId,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

const ALLOWED_CATEGORIES = ["4-5", "3", "heaven-on-sea", "boonmax-carnival", "rustar", "najom"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const categories = categoryParam
      ? categoryParam.split(",").map((c) => c.trim()).filter((c) => ALLOWED_CATEGORIES.includes(c))
      : [];

    await connectToDatabase();

    const query = categories.length > 0 ? { category: { $in: categories } } : {};

    const bookings = await StarBooking.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
