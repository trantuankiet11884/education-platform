import { NextResponse } from "next/server"
import { Enrollment } from "@/lib/models/enrollment"
import { Course } from "@/lib/models/course"
import { User } from "@/lib/models/user"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    await connectToDatabase()
    const enrollments = await Enrollment.find().populate("userId", "name email").populate("courseId", "title")

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      userId: body.userId,
      courseId: body.courseId,
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: "User already enrolled in this course" }, { status: 400 })
    }

    // Create the enrollment
    const enrollment = new Enrollment({
      ...body,
      progress: 0,
      completedLessons: [],
      startDate: new Date(),
      lastAccessDate: new Date(),
      isCompleted: false,
    })

    await enrollment.save()

    // Update the course's enrollment count
    await Course.findByIdAndUpdate(body.courseId, { $inc: { enrollmentCount: 1 } })

    // Add the course to the user's enrolled courses
    await User.findByIdAndUpdate(body.userId, { $addToSet: { enrolledCourses: body.courseId } })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error("Error creating enrollment:", error)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  }
}

