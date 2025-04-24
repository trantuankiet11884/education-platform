import { NextResponse } from "next/server"
import { Review } from "@/lib/models/review"
import { Course } from "@/lib/models/course"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    await connectToDatabase()
    const reviews = await Review.find().populate("userId", "name avatar").populate("courseId", "title")

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({
      userId: body.userId,
      courseId: body.courseId,
    })

    if (existingReview) {
      return NextResponse.json({ error: "User already reviewed this course" }, { status: 400 })
    }

    // Create the review
    const review = new Review({
      ...body,
      createdAt: new Date(),
    })

    await review.save()

    // Update the course's rating
    const courseReviews = await Review.find({ courseId: body.courseId })
    const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / courseReviews.length

    await Course.findByIdAndUpdate(body.courseId, { rating: averageRating })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

