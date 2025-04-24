import mongoose, { Schema, type Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail?: string;
  price: number;
  instructor: mongoose.Types.ObjectId;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  lessonCount: number;
  duration: number;
  rating: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String },
  price: { type: Number, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  tags: [{ type: String }],
  lessonCount: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  enrollmentCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
});

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
