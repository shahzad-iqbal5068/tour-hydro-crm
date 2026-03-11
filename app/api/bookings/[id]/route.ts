import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Booking } from "@/models/Booking";

export async function GET(_request: NextRequest, context: any) {
  try {
    const { params } = context;
    await connectToDatabase();
    const booking = await Booking.findById(params.id).lean();

    if (!booking) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const { params } = context;
    const body = await request.json();
    const { date, shift, name, email, whatsappPackage, remarks } = body;

    await connectToDatabase();

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      {
        date: new Date(date),
        shift,
        name,
        email,
        whatsappPackage,
        remarks,
      },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

