import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { Attendance } from "@/models/Attendance";
import { verifyToken } from "@/lib/auth";

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function POST(request: NextRequest) {
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

    const body = (await request.json().catch(() => ({}))) as {
      location?: string;
      photoUrl?: string;
    };

    await connectToDatabase();
    const dateKey = todayKey();

    const now = new Date();

    const update: Record<string, unknown> = {
      checkOutAt: now,
    };
    if (body.location) update.location = body.location;
    if (body.photoUrl) update.photoUrl = body.photoUrl;

    const attendance = await Attendance.findOneAndUpdate(
      { user: jwtUser.id, date: dateKey },
      { $set: update },
      { new: true }
    ).lean();

    if (!attendance) {
      return NextResponse.json(
        { message: "No attendance record for today" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        _id: attendance._id.toString(),
        date: attendance.date,
        checkInAt: attendance.checkInAt,
        checkOutAt: attendance.checkOutAt,
        location: attendance.location,
        photoUrl: attendance.photoUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error ending attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

