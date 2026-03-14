import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requirePermission, Permission } from "@/lib/permissions";

const MIN_PASSWORD_LENGTH = 6;

export async function GET() {
  const auth = await requirePermission(Permission.MANAGE_USERS);
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requirePermission(Permission.MANAGE_USERS);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { id, name, email, role, password } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "Name, email and role are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (id) {
      // Update existing user
      const update: { name: string; email: string; role: string; passwordHash?: string } = {
        name,
        email,
        role,
      };
      if (password && String(password).trim().length >= MIN_PASSWORD_LENGTH) {
        update.passwordHash = await bcrypt.hash(String(password).trim(), 10);
      }

      const updated = await User.findByIdAndUpdate(id, update, { new: true }).lean();

      if (!updated) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(
        {
          id: updated._id.toString(),
          name: updated.name,
          email: updated.email,
          role: updated.role,
        },
        { status: 200 }
      );
    }

    // Create new user — password required
    if (!password || String(password).trim().length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { message: `Password is required and must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(String(password).trim(), 10);
    const created = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    return NextResponse.json(
      {
        id: created._id.toString(),
        name: created.name,
        email: created.email,
        role: created.role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

