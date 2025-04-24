import { NextResponse } from "next/server"
import { Lesson } from "@/lib/models/lesson"
import { Course } from "@/lib/models/course"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await connectToDatabase()

    const lesson = await Lesson.findById(id)

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    await connectToDatabase()

    const originalLesson = await Lesson.findById(id)
    if (!originalLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Update the lesson
    const lesson = await Lesson.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true })

    // If duration changed, update the course's total duration
    if (body.duration && body.duration !== originalLesson.duration) {
      const durationDiff = body.duration - originalLesson.duration
      await Course.findByIdAndUpdate(originalLesson.courseId, { $inc: { duration: durationDiff } })
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Error updating lesson:", error)
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await connectToDatabase()

    const lesson = await Lesson.findById(id)
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(id)

    // Update the course's lessonCount and duration
    await Course.findByIdAndUpdate(lesson.courseId, { $inc: { lessonCount: -1, duration: -lesson.duration } })

    return NextResponse.json({ message: "Lesson deleted successfully" })
  } catch (error) {
    console.error("Error deleting lesson:", error)
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 })
  }
}

