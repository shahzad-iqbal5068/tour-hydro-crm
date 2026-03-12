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

    // Only admin-like roles can see all attendance
    if (
      !["SUPER_ADMIN", "ADMIN", "MANAGER", "CEO"].includes(
        jwtUser.role.toUpperCase()
      )
    ) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;
    const role = searchParams.get("role") || undefined;
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const query: Record<string, unknown> = {};

    if (date) {
      query.date = date;
    } else if (monthParam && yearParam) {
      const month = Number(monthParam);
      const year = Number(yearParam);
      if (!Number.isNaN(month) && !Number.isNaN(year)) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        const startKey = `${start.getFullYear()}-${String(
          start.getMonth() + 1
        ).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
        const endKey = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(end.getDate()).padStart(2, "0")}`;
        query.date = { $gte: startKey, $lte: endKey };
      }
    }

    if (role) query.role = role;

    await connectToDatabase();

    const records = await Attendance.find(query)
      .sort({ date: -1, checkInAt: -1 })
      .lean()
      .exec();

    const data = records.map((r) => ({
      _id: r._id.toString(),
      userId: r.user.toString(),
      name: r.name,
      email: r.email,
      role: r.role,
      date: r.date,
      checkInAt: r.checkInAt,
      checkOutAt: r.checkOutAt,
      location: r.location,
      photoUrl: r.photoUrl,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error listing attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

