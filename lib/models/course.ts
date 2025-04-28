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
  isPublished: boolean;
  reviews: mongoose.Types.ObjectId[];
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
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CourseSchema.pre("save", async function (next) {
  if (this.reviews.length > 0) {
    const reviews = await mongoose
      .model("Review")
      .find({ _id: { $in: this.reviews } });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / reviews.length;
  } else {
    this.rating = 0;
  }
  next();
});

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
