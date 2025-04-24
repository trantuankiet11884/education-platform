import { NextResponse } from "next/server"
import { Quiz } from "@/lib/models/quiz"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    await connectToDatabase()
    const quizzes = await Quiz.find().populate("createdBy", "name").populate("courseId", "title")

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()

    const quiz = new Quiz({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await quiz.save()

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}

