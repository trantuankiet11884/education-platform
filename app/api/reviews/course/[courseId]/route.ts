import { NextResponse } from "next/server"
import { Review } from "@/lib/models/review"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = params
    await connectToDatabase()

    const reviews = await Review.find({ courseId }).populate("userId", "name avatar").sort({ createdAt: -1 })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

