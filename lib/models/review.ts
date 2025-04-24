import mongoose, { Schema, type Document } from "mongoose"

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)

