import mongoose, { Schema, type Document } from "mongoose"

export interface IQuestion extends Document {
  text: string
  options: string[]
  correctOption: number
  explanation?: string
}

const QuestionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctOption: { type: Number, required: true },
  explanation: { type: String },
})

export interface IQuiz extends Document {
  title: string
  description: string
  courseId?: mongoose.Types.ObjectId
  questions: IQuestion[]
  timeLimit?: number // in minutes
  passingScore: number
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const QuizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  questions: [QuestionSchema],
  timeLimit: { type: Number },
  passingScore: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema)

