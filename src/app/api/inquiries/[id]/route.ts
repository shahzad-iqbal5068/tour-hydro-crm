import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    const inquiry = await Inquiry.findById(id).lean();
    console.log("inquiry", inquiry);

    if (!inquiry) {
      return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(inquiry, { status: 200 });
  } catch (error) {
    console.error("Error fetching inquiry:", error);
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
    const { date, shift, whatsappName, remarks } = body;

    await connectToDatabase();

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      {
        date: date ? new Date(date) : undefined,
        shift,
        whatsappName,
        remarks,
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

