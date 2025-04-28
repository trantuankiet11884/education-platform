import axios from "axios";
import type {
  Course,
  Enrollment,
  Lesson,
  Review,
  User,
  Quiz,
  Book,
  BlogPost,
  Log,
} from "./data";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// api.ts
export const logsApi = {
  getAll: async () => {
    const response = await api.get<Log[]>("/logs");
    return response.data;
  },
};

// Courses API
export const coursesApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get<any>(`/courses?page=${page}&limit=${limit}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await api.get<Course>(`/courses/slug/${slug}`);
    return response.data;
  },
  create: async (course: Partial<Course>) => {
    const response = await api.post<Course>("/courses", course);
    return response.data;
  },
  update: async (id: string, course: Partial<Course>) => {
    const response = await api.put<Course>(`/courses/${id}`, course);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

// Lessons API
export const lessonsApi = {
  getAll: async () => {
    const response = await api.get<Lesson[]>("/lessons");
    return response.data;
  },
  getByCourseId: async (courseId: string) => {
    const response = await api.get<Lesson[]>(`/lessons/course/${courseId}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Lesson>(`/lessons/${id}`);
    return response.data;
  },
  create: async (lesson: Partial<Lesson>) => {
    const response = await api.post<Lesson>("/lessons", lesson);
    return response.data;
  },
  update: async (id: string, lesson: Partial<Lesson>) => {
    const response = await api.put<Lesson>(`/lessons/${id}`, lesson);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
  getByFirebaseId: async (firebaseId: string) => {
    const response = await api.get<User>(`/users/firebase/${firebaseId}`);
    return response.data;
  },
  update: async (id: string, user: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  create: async (user: Partial<User>) => {
    const response = await api.post<User>("/users", user);
    return response.data;
  },
};

// Enrollments API
export const enrollmentsApi = {
  getAll: async () => {
    const response = await api.get<Enrollment[]>("/enrollments");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Enrollment>(`/enrollments/${id}`);
    return response.data;
  },
  getByUserId: async (userId: string) => {
    const response = await api.get<Enrollment[]>(`/enrollments/user/${userId}`);
    return response.data;
  },
  getByCourseId: async (courseId: string) => {
    const response = await api.get<Enrollment[]>(
      `/enrollments/course/${courseId}`
    );
    return response.data;
  },
  create: async (enrollment: Partial<Enrollment>) => {
    const response = await api.post<Enrollment>("/enrollments", enrollment);
    return response.data;
  },
  updateProgress: async (
    id: string,
    progress: number,
    completedLessons: string[]
  ) => {
    const response = await api.put<Enrollment>(`/enrollments/${id}/progress`, {
      progress,
      completedLessons,
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  },
};

// Reviews API
export const reviewsApi = {
  getAll: async () => {
    const response = await api.get<Review[]>("/reviews");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Review>(`/reviews/${id}`);
    return response.data;
  },
  getByCourseId: async (courseId: string) => {
    const response = await api.get<Review[]>(`/reviews/course/${courseId}`);
    return response.data;
  },
  create: async (review: Partial<Review>) => {
    const response = await api.post<Review>("/reviews", review);
    return response.data;
  },
  update: async (id: string, review: Partial<Review>) => {
    const response = await api.put<Review>(`/reviews/${id}`, review);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// Quizzes API
export const quizzesApi = {
  getAll: async () => {
    const response = await api.get<Quiz[]>("/quizzes");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Quiz>(`/quizzes/${id}`);
    return response.data;
  },
  create: async (quiz: Partial<Quiz>) => {
    const response = await api.post<Quiz>("/quizzes", quiz);
    return response.data;
  },
  update: async (id: string, quiz: Partial<Quiz>) => {
    const response = await api.put<Quiz>(`/quizzes/${id}`, quiz);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
};

// Books API
export const booksApi = {
  getAll: async () => {
    const response = await api.get<Book[]>("/books");
    return response.data;
  },
  getAllById: async (id: string) => {
    const response = await api.get<Book[]>(`/books/user/${id}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },
  create: async (book: Partial<Book>) => {
    const response = await api.post<Book>("/books", book);
    return response.data;
  },
  update: async (id: string, book: Partial<Book>) => {
    const response = await api.put<Book>(`/books/${id}`, book);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
};

// Blog Posts API
export const blogApi = {
  getAll: async () => {
    const response = await api.get<BlogPost[]>("/blog");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<BlogPost>(`/blog/${id}`);
    return response.data;
  },
  getBySlug: async (slug: string) => {
    const response = await api.get<BlogPost>(`/blog/slug/${slug}`);
    return response.data;
  },
  create: async (post: Partial<BlogPost>) => {
    const response = await api.post<BlogPost>("/blog", post);
    return response.data;
  },
  update: async (id: string, post: Partial<BlogPost>) => {
    const response = await api.put<BlogPost>(`/blog/${id}`, post);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },
};

// Quiz Attempts API
export const quizAttemptsApi = {
  getByUserId: async (userId: string) => {
    const response = await api.get<any>(`/quiz-attempts/user/${userId}`);
    return response.data;
  },
};
