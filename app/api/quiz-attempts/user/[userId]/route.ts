import { NextResponse } from "next/server";
import { QuizAttempt } from "@/lib/models/quiz-attempt";
import { connectToDatabase } from "@/lib/db";
import { Quiz } from "@/lib/models/quiz"; // Giữ import này để chắc chắn

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = params;
    await connectToDatabase();

    const attempts = await QuizAttempt.find({ userId })
      .populate("quizId", "title timeLimit passingScore")
      .sort({ completedAt: -1 });

    return NextResponse.json(attempts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user quiz attempts" },
      { status: 500 }
    );
  }
}
