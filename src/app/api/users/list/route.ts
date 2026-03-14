import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { requireAuth } from "@/lib/permissions";

/**
 * Returns minimal user list (id, name) for dropdowns (e.g. inquiry "Name" field).
 * Any authenticated user can call this.
 */
export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const users = await User.find()
      .sort({ name: 1 })
      .select("_id name")
      .lean();

    return NextResponse.json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users list:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
