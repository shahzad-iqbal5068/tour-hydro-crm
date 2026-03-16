import { NextResponse } from "next/server";
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

export async function GET() {
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

    const att = await Attendance.findOne({
      user: jwtUser.id,
      date: dateKey,
    })
      .lean()
      .exec();

    if (!att) {
      return NextResponse.json(
        { status: "none", date: dateKey, record: null },
        { status: 200 }
      );
    }

    let status: "checked_in" | "closed" = "checked_in";
    if (att.checkOutAt) {
      status = "closed";
    }

    return NextResponse.json(
      {
        status,
        date: dateKey,
        record: {
          _id: att._id.toString(),
          checkInAt: att.checkInAt,
          checkOutAt: att.checkOutAt,
          location: att.location,
          photoUrl: att.photoUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error loading attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

