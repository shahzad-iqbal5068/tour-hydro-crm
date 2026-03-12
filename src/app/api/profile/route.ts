import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyToken, signUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, avatarUrl } = body as {
      name?: string;
      avatarUrl?: string | null;
    };

    const update: Record<string, unknown> = {};
    if (typeof name === "string" && name.trim()) {
      update.name = name.trim();
    }
    if (typeof avatarUrl === "string" && avatarUrl.trim()) {
      update.avatarUrl = avatarUrl.trim();
    } else if (avatarUrl === null) {
      update.avatarUrl = undefined;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { message: "Nothing to update" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updatedDoc = await User.findByIdAndUpdate(jwtUser.id, update, {
      new: true,
    });

    if (!updatedDoc) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updated = updatedDoc.toObject();

    // Refresh JWT so avatarUrl is present on next reload
    const newToken = signUser(updatedDoc);
    const res = NextResponse.json(
      {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatarUrl: updated.avatarUrl ?? null,
      },
      { status: 200 }
    );

    res.cookies.set("auth_token", newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

