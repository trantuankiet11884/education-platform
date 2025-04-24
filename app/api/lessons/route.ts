// app/api/lesson/route.ts
import { NextResponse } from "next/server";
import { Lesson } from "@/lib/models/lesson";
import { Course } from "@/lib/models/course";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    const lessons = await Lesson.find().sort({ courseId: 1, order: 1 });
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request body:", body);
    await connectToDatabase();

    // Validate courseId
    const course = await Course.findById(body.courseId);
    if (!course) {
      return NextResponse.json(
        { error: `Course with ID ${body.courseId} not found` },
        { status: 404 }
      );
    }

    const lesson = new Lesson({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await lesson.save();

    await Course.findByIdAndUpdate(body.courseId, {
      $inc: { lessonCount: 1, duration: body.duration },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson", details: error.message },
      { status: 500 }
    );
  }
}
