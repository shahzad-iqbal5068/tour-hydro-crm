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

export async function POST(_request: NextRequest) {
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

    await connectToDatabase();
    const dateKey = todayKey();

    const now = new Date();

    const attendance = await Attendance.findOneAndUpdate(
      { user: jwtUser.id, date: dateKey },
      {
        $set: {
          checkOutAt: now,
        },
      },
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

