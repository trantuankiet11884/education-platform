import mongoose, { Schema, type Document } from "mongoose"

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId
  quizId: mongoose.Types.ObjectId
  answers: number[]
  score: number
  passed: boolean
  startedAt: Date
  completedAt: Date
}

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: { type: [Number], required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date, required: true },
})

export const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema)

