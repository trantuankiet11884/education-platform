import mongoose, { Schema, type Document } from "mongoose"

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  progress: number
  completedLessons: mongoose.Types.ObjectId[]
  startDate: Date
  lastAccessDate: Date
  isCompleted: boolean
  certificate?: string
}

const EnrollmentSchema = new Schema<IEnrollment>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  progress: { type: Number, default: 0 },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  startDate: { type: Date, default: Date.now },
  lastAccessDate: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  certificate: { type: String },
})

export const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema)

