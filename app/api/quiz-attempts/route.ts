import { NextResponse } from "next/server";
import { QuizAttempt } from "@/lib/models/quiz-attempt";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    const attempts = await QuizAttempt.find()
      .populate("userId", "name email")
      .populate("quizId", "title");

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz attempts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const attempt = new QuizAttempt({
      userId: body.userId,
      quizId: body.quizId,
      answers: body.answers,
      score: body.score,
      passed: body.passed,
      startedAt: body.startedAt,
      completedAt: body.completedAt,
    });

    await attempt.save();

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz attempt:", error);
    return NextResponse.json(
      { error: "Failed to create quiz attempt" },
      { status: 500 }
    );
  }
}
