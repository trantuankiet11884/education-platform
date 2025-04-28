import mongoose, { Schema, type Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ReviewSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
