import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Inquiry } from "@/models/Inquiry";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, shift, whatsappName, remarks, contact, userId } = body;

    if (!date || !shift || !whatsappName) {
      return NextResponse.json(
        { message: "Date, shift and WhatsApp name are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const inquiry = await Inquiry.create({
      date: new Date(date),
      shift,
      whatsappName,
      remarks,
      contact,
      userId: userId || undefined,
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry:", error);
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
    const nameFilter = searchParams.get("package") || ""; // reuse existing param name
    const sortDate = searchParams.get("sortDate") || "desc";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "10");
    const q = searchParams.get("q") || "";

    const query: Record<string, unknown> = {};
    if (nameFilter) {
      query.whatsappName = nameFilter;
    }
    if (q) {
      query.$or = [
        { whatsappName: { $regex: q, $options: "i" } },
        { remarks: { $regex: q, $options: "i" } },
      ];
    }

    await connectToDatabase();

    const total = await Inquiry.countDocuments(query);

    const inquiries = await Inquiry.find(query)
      .sort({ date: sortDate === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name")
      .lean();

    const data = inquiries.map((inv) => {
      const u = inv as unknown as { userId?: { _id: unknown; name: string } | null };
      const populated = u.userId && typeof u.userId === "object" && "name" in u.userId ? (u.userId as { _id: unknown; name: string }) : null;
      return {
        ...u,
        name: populated?.name ?? null,
        userId: populated?._id ? String(populated._id) : (u.userId != null ? String(u.userId) : null),
      };
    });

    return NextResponse.json(
      {
        data,
        total,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

