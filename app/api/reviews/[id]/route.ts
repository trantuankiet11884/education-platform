// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/lib/models/review";
import { Enrollment } from "@/lib/models/enrollment";
import { Course } from "@/lib/models/course";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { rating, comment, userId, courseId } = await req.json();

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Check if the user is enrolled
    const enrollment = await Enrollment.findOne({
      userId: new mongoose.Types.ObjectId(userId?._id),
      courseId: new mongoose.Types.ObjectId(courseId),
    });
    if (!enrollment) {
      return NextResponse.json(
        { message: "You must be enrolled in the course to update a review." },
        { status: 403 }
      );
    }

    // Find and update the review
    const review = await Review.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId?._id),
    });
    if (!review) {
      return NextResponse.json(
        { message: "Review not found or you are not authorized to update it." },
        { status: 404 }
      );
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// app/api/reviews/[id]/route.ts
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { userId } = await req.json();

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid review ID" },
        { status: 400 }
      );
    }

    // Find and delete the review
    const review = await Review.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(userId?._id),
    });
    if (!review) {
      return NextResponse.json(
        { message: "Review not found or you are not authorized to delete it." },
        { status: 404 }
      );
    }

    // Optionally, remove review reference from Course
    await Course.findByIdAndUpdate(review.courseId, {
      $pull: { reviews: review._id },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
