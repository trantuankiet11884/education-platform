// lib/models/index.ts
import mongoose from "mongoose";

// Import tất cả các model để đảm bảo chúng được đăng ký
import { User } from "./user";
import { QuizAttempt } from "./quiz-attempt";
import { Quiz } from "./quiz";
import { BlogPost } from "./blog-post";
import { Book } from "./book";
import { Course } from "./course";
import { Enrollment } from "./enrollment";
import { Lesson } from "./lesson";
import { Review } from "./review";
// Hàm này không cần trả về gì, chỉ cần đảm bảo các model được import
export function registerModels() {
  console.log("Registering Mongoose models...");
  // Các model đã được đăng ký thông qua import ở trên
  console.log("Models registered:", Object.keys(mongoose.models));
}
