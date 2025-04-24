import { NextResponse } from "next/server"
import { Course } from "@/lib/models/course"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await connectToDatabase()

    const course = await Course.findById(id).populate("instructor", "name email avatar bio")

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    await connectToDatabase()

    const course = await Course.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true }).populate(
      "instructor",
      "name email avatar bio",
    )

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await connectToDatabase()

    const course = await Course.findByIdAndDelete(id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}

