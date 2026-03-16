import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in auth/me:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

