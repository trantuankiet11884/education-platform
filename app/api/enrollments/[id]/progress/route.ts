import { NextResponse } from "next/server";
import { Enrollment } from "@/lib/models/enrollment";
import { connectToDatabase } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { progress, completedLessons } = await request.json();
    await connectToDatabase();

    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      { progress, completedLessons, lastAccessDate: new Date() },
      { new: true }
    );

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error updating enrollment progress:", error);
    return NextResponse.json(
      { error: "Failed to update enrollment progress" },
      { status: 500 }
    );
  }
}
