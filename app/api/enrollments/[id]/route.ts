// app/api/ẻnrollments/[id]/route.ts
import { NextResponse } from "next/server";
import { Enrollment } from "@/lib/models/enrollment";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    const enrollment = await Enrollment.findById(id)
      .populate("userId", "name email")
      .populate("courseId", "title")
      .populate("completedLessons", "title");

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    await connectToDatabase();

    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      { ...body, lastAccessDate: new Date() },
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
    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Delete the enrollment
    await Enrollment.findByIdAndDelete(id);

    return NextResponse.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return NextResponse.json(
      { error: "Failed to delete enrollment" },
      { status: 500 }
    );
  }
}
