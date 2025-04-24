import { NextResponse } from "next/server";
import { Lesson } from "@/lib/models/lesson";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    await connectToDatabase();

    const lessons = await Lesson.find({ courseId }).sort({ order: 1 });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
