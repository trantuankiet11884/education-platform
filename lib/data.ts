export interface Log {
  _id: string;
  event: string; // e.g., "User Login", "Course Created"
  userId: string | User; // Reference to the user who triggered the event
  ipAddress: string; // e.g., "192.168.1.1"
  timestamp: string; // ISO date string, e.g., "2025-04-07T10:00:00Z"
}

export interface User {
  _id: string;
  name: string;
  email: string;
  paypalEmail?: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
  bio?: string;
  createdAt: string;
  enrolledCourses?: string[];
  teachingCourses?: string[];
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail?: string;
  price: number;
  instructor: User;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  lessonCount: number;
  duration: number; // in minutes
  rating: number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
  isPublished?: boolean;
}

export interface Lesson {
  _id: string;
  title: string;
  courseId: Course | string;
  order: number;
  content: string;
  videoUrl?: string;
  duration: number;
  isPublished: boolean;
  description: string;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Enrollment {
  _id: string;
  userId: string;
  courseId: Course | string;
  progress: number;
  completedLessons: string[];
  startDate: string;
  lastAccessDate: string;
  isCompleted: boolean;
  certificate?: string;
}

export interface Review {
  _id: string;
  userId: string;
  courseId: Course | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Question {
  _id: string;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  courseId?: Course;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  fileUrl: string;
  category: string;
  tags: string[];
  price: number;
  isFree: boolean;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: User;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
