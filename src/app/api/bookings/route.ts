import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, shift, name, email, whatsappPackage, remarks } = body;

    if (!date || !shift || !name || !email || !whatsappPackage) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const booking = await Booking.create({
      date: new Date(date),
      shift,
      name,
      email,
      whatsappPackage,
      remarks,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packageFilter = searchParams.get("package") || "";
    const sortDate = searchParams.get("sortDate") || "desc";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = {};
    if (packageFilter) {
      query.whatsappPackage = packageFilter;
    }

    await connectToDatabase();

    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .sort({ date: sortDate === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        data: bookings,
        total,
        page,
        limit,
      },
      { status: 200 }
    );
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

