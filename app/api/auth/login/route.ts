import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signUser } from "@/lib/auth";

const SUPER_ADMIN_EMAIL = "choudhuryshahzad5068@gmail.com";
const SUPER_ADMIN_PASSWORD = "Shahzad5068@";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let user = await User.findOne({ email });

    // Auto-create super admin if not present and credentials match
    if (!user && email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        name: "Shahzad",
        email,
        passwordHash,
        role: "SUPER_ADMIN",
      });
    }

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signUser(user);

    const res = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    res.cookies.set("auth_token", token, {
      httpOnly: false, // allow client-side read for SPA auth
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("Error in login:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}

