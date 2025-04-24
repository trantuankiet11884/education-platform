import { NextResponse } from "next/server";
import { User } from "@/lib/models/user";
import { connectToDatabase } from "@/lib/db";

// Existing POST handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Creating user with data:", body);

    await connectToDatabase();

    if (!body.email || !body.name || !body.firebaseId) {
      console.error("Missing required fields:", {
        email: body.email,
        name: body.name,
        firebaseId: body.firebaseId,
      });
      return NextResponse.json(
        { error: "Missing required fields: email, name, or firebaseId" },
        { status: 400 }
      );
    }

    const existingUserByFirebaseId = await User.findOne({
      firebaseId: body.firebaseId,
    });
    if (existingUserByFirebaseId) {
      console.log("User already exists with firebaseId:", body.firebaseId);
      return NextResponse.json(existingUserByFirebaseId);
    }

    const existingUserByEmail = await User.findOne({ email: body.email });
    if (existingUserByEmail) {
      console.log("User already exists with email:", body.email);
      existingUserByEmail.firebaseId = body.firebaseId;
      await existingUserByEmail.save();
      return NextResponse.json(existingUserByEmail);
    }

    const user = new User({
      ...body,
      createdAt: new Date(),
    });

    await user.save();
    console.log("User created successfully:", user);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Add GET handler for /api/users
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Fetch all users (you might want to add pagination or filtering)
    const users = await User.find()
      .populate("enrolledCourses")
      .populate("teachingCourses");

    console.log("Fetched all users:", users.length);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: (error as Error).message },
      { status: 500 }
    );
  }
}
