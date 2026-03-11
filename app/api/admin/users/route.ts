import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
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
  try {
    const body = await request.json();
    const { id, name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: "Name, email and role are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (id) {
      // Update existing user (without changing password here)
      const updated = await User.findByIdAndUpdate(
        id,
        { name, email, role },
        { new: true }
      ).lean();

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

    // Create new user with a placeholder password; real password flow can be added later
    const created = await User.create({
      name,
      email,
      passwordHash: "placeholder",
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

