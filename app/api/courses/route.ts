// app/api/courses/route.ts

import { NextResponse } from "next/server";
import { Course } from "@/lib/models/course";
import { connectToDatabase } from "@/lib/db";
import { getPaginationParams, getPaginatedResponse } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Get pagination parameters
    const { page, limit, skip } = getPaginationParams(request);

    // Get total count
    const totalItems = await Course.countDocuments();

    // Get paginated courses
    const courses = await Course.find()
      .populate("instructor", "name email avatar bio")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Return paginated response
    return NextResponse.json(
      getPaginatedResponse(courses, totalItems, page, limit)
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const course = new Course(body);
    await course.save();
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("Error creating course:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A course with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create course", details: error.message },
      { status: 500 }
    );
  }
}
