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
    const inquiry = await Inquiry.findById(id).populate("userId", "name").lean();

    if (!inquiry) {
      return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
    }

    const inv = inquiry as unknown as { userId?: { _id: unknown; name: string } | null };
    const populated = inv.userId && typeof inv.userId === "object" && "name" in inv.userId ? inv.userId : null;
    return NextResponse.json({
      ...inquiry,
      name: populated?.name ?? null,
      userId: populated?._id ? String(populated._id) : (inv.userId != null ? (typeof inv.userId === "object" && "_id" in inv.userId ? String((inv.userId as { _id: unknown })._id) : String(inv.userId)) : null),
    }, { status: 200 });
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
    const { date, shift, whatsappName, remarks, userId } = body;

    await connectToDatabase();

    const update: Record<string, unknown> = {
      date: date ? new Date(date) : undefined,
      shift,
      whatsappName,
      remarks,
    };
    if (userId !== undefined) {
      update.userId = userId || null;
    }

    const updated = await Inquiry.findByIdAndUpdate(id, update, { new: true })
      .populate("userId", "name")
      .lean();

    if (!updated) {
      return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
    }

    const upd = updated as unknown as { userId?: { _id: unknown; name: string } | null };
    const populated = upd.userId && typeof upd.userId === "object" && "name" in upd.userId ? upd.userId : null;
    return NextResponse.json({
      ...updated,
      name: populated?.name ?? null,
      userId: populated?._id ? String(populated._id) : (upd.userId != null ? (typeof upd.userId === "object" && "_id" in upd.userId ? String((upd.userId as { _id: unknown })._id) : String(upd.userId)) : null),
    }, { status: 200 });
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

export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = await context.params;

  try {
    await connectToDatabase();

    const deleted = await Inquiry.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Inquiry deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}


