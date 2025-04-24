import { NextResponse } from "next/server"
import { Enrollment } from "@/lib/models/enrollment"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    await connectToDatabase()

    const enrollments = await Enrollment.find({ userId }).populate({
      path: "courseId",
      select: "title thumbnail category level lessonCount duration",
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

