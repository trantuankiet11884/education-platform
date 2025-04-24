import mongoose, { Schema, type Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  courseId: mongoose.Types.ObjectId;
  order: number;
  content: string;
  description: string;
  isFree: boolean;
  videoUrl?: string;
  duration: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  order: { type: Number, required: true },
  content: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  isFree: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Lesson =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
