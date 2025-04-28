import { NextResponse } from "next/server";
import { User } from "@/lib/models/user";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { firebaseId: string } }
) {
  try {
    const { firebaseId } = params;

    await connectToDatabase();

    const user = await User.findOne({ firebaseId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user by firebaseId:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
