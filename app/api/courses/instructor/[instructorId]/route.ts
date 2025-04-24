import { NextResponse } from "next/server";
import { Course } from "@/lib/models/course";
import { connectToDatabase } from "@/lib/db";
import { getPaginationParams, getPaginatedResponse } from "@/lib/api-utils";

export async function GET(
  request: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const { instructorId } = params;
    await connectToDatabase();

    // Get pagination parameters
    const { page, limit, skip } = getPaginationParams(request);

    // Get total count of instructor's courses
    const totalItems = await Course.countDocuments({
      instructor: instructorId,
    });

    // Get paginated courses for the specific instructor
    const courses = await Course.find({ instructor: instructorId })
      .populate("instructor", "name email avatar bio")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Return paginated response
    return NextResponse.json(
      getPaginatedResponse(courses, totalItems, page, limit)
    );
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch instructor courses" },
      { status: 500 }
    );
  }
}
