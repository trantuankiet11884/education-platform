import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  firebaseId: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
  bio?: string;
  purchasedCourses?: mongoose.Types.ObjectId[];
  paypalEmail?: string;
  createdAt: Date;
  enrolledCourses?: mongoose.Types.ObjectId[];
  teachingCourses?: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  firebaseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  avatar: { type: String },
  bio: { type: String },
  purchasedCourses: { type: [Schema.Types.ObjectId], ref: "Course" },
  paypalEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  teachingCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
});

// Đảm bảo model chỉ được định nghĩa một lần
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
