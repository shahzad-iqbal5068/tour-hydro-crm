import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jwtUser = verifyToken(token);
    if (!jwtUser) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = Math.min(
      60,
      Math.max(1, Number(limitParam || "30") || 30)
    );

    await connectToDatabase();

    const records = await Attendance.find({ user: jwtUser.id })
      .sort({ date: -1, checkInAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    const data = records.map((r) => ({
      _id: r._id.toString(),
      date: r.date,
      checkInAt: r.checkInAt,
      checkOutAt: r.checkOutAt,
      location: r.location,
      photoUrl: r.photoUrl,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error loading my attendance history:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

