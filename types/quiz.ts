// Type cho câu hỏi
export interface Question {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

export interface QuizFormState {
  title: string;
  description: string;
  courseId: string;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
}

export interface Course {
  _id: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  instructor?: string | { _id: string; name: string };
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  lessonCount?: number;
  duration?: number;
  rating?: number;
  enrollmentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  lessons?: Array<{ _id: string; title: string }>;
  isPublished?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  _id: string;
  name?: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export interface CSVQuestion {
  question_text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
}

export interface JSONQuestion {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}
