import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Enrollment } from "@/lib/models/enrollment";
import { Review } from "@/lib/models/review";
import { Course } from "@/lib/models/course";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { userId, courseId, rating, comment } = await req.json();

    if (
      !mongoose.Types.ObjectId.isValid(userId?._id) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return NextResponse.json(
        { message: "Invalid user or course ID" },
        { status: 400 }
      );
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(userId?._id),
      courseId: new mongoose.Types.ObjectId(courseId),
    });
    if (!enrollment) {
      return NextResponse.json(
        { message: "You must enroll in the course to review it." },
        { status: 403 }
      );
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      userId: new mongoose.Types.ObjectId(userId?._id),
      courseId: new mongoose.Types.ObjectId(courseId),
    });
    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this course." },
        { status: 400 }
      );
    }

    // Create and save review
    const review = new Review({
      userId: new mongoose.Types.ObjectId(userId?._id),
      courseId: new mongoose.Types.ObjectId(courseId),
      rating,
      comment,
    });
    await review.save();

    // Update course with review reference
    await Course.findByIdAndUpdate(courseId, {
      $push: { reviews: review._id },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find().populate("userId", "name avatar");
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
