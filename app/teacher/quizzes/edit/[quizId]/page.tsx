"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { quizzesApi, coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { Quiz, Course, Question } from "@/lib/data";
import { Icons } from "@/components/icons";

// Định nghĩa kiểu cho câu hỏi trong form (không yêu cầu _id)
type FormQuestion = {
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
};

// Định nghĩa kiểu cho formData với courseId và createdBy là string
type QuizFormData = Omit<Quiz, "courseId" | "questions" | "createdBy"> & {
  courseId?: string;
  questions: FormQuestion[];
  createdBy?: string;
};

export default function EditQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = React.use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizzesApi.getById(quizId),
    enabled: !!user && user.role === "teacher",
  });

  const [formData, setFormData] = useState<QuizFormData | undefined>(undefined);

  const { data: coursesData = { data: [] } } = useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesApi.getAll(),
    enabled: !!user && user.role === "teacher",
  });

  const updateQuizMutation = useMutation({
    mutationFn: (updatedQuiz: Partial<Quiz>) =>
      quizzesApi.update(quizId, updatedQuiz),
    onSuccess: () => {
      toast({ title: "Quiz updated successfully" });
      router.push("/teacher/quizzes");
    },
    onError: (error: any) => {
      toast({
        title: "Error updating quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: () => quizzesApi.delete(quizId),
    onSuccess: () => {
      toast({ title: "Quiz deleted successfully" });
      router.push("/teacher/quizzes");
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  React.useEffect(() => {
    if (quiz) {
      setFormData({
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        courseId: quiz.courseId?._id || "",
        questions: quiz.questions.map((q) => ({
          text: q.text,
          options: q.options,
          correctOption: q.correctOption,
          explanation: q.explanation || "",
        })),
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        createdBy: quiz.createdBy._id,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt,
      });
    }
  }, [quiz]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Chuyển đổi formData thành Partial<Quiz>
    const updatedQuiz: any = {
      ...formData,
      courseId: formData.courseId as any, // Ép kiểu tạm thời vì server chấp nhận string
      questions: formData.questions as any, // Ép kiểu tạm thời vì server không yêu cầu _id
    };

    updateQuizMutation.mutate(updatedQuiz);
  };

  const addQuestion = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: "",
          options: ["", "", "", ""],
          correctOption: 0,
          explanation: "",
        },
      ],
    });
  };

  if (loading || quizLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Icons.logo className="h-8 w-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (!user || user.role !== "teacher") {
    return <p>Access denied. Only teachers can edit quizzes.</p>;
  }

  if (!formData) {
    return <p>Quiz not found.</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-6">Edit Quiz</h1>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            <div>
              <label className="block font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block font-medium">Course</label>
              <select
                value={formData.courseId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select a course (optional)</option>
                {coursesData.data.map((course: Course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">Time Limit (minutes)</label>
              <Input
                type="number"
                value={formData.timeLimit || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    timeLimit: Number(e.target.value),
                  })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block font-medium">Passing Score (%)</label>
              <Input
                type="number"
                value={formData.passingScore}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passingScore: Number(e.target.value),
                  })
                }
                min="0"
                max="100"
              />
            </div>
            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded">
                <label className="block font-medium">
                  Question {qIndex + 1}
                </label>
                <Input
                  value={q.text}
                  onChange={(e) => {
                    const newQuestions = [...formData.questions];
                    newQuestions[qIndex].text = e.target.value;
                    setFormData({ ...formData, questions: newQuestions });
                  }}
                  placeholder="Question text"
                  required
                />
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="mt-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newQuestions = [...formData.questions];
                        newQuestions[qIndex].options[oIndex] = e.target.value;
                        setFormData({ ...formData, questions: newQuestions });
                      }}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                  </div>
                ))}
                <div className="mt-2">
                  <label className="block font-medium">Correct Option</label>
                  <select
                    value={q.correctOption}
                    onChange={(e) => {
                      const newQuestions = [...formData.questions];
                      newQuestions[qIndex].correctOption = Number(
                        e.target.value
                      );
                      setFormData({ ...formData, questions: newQuestions });
                    }}
                    className="w-full p-2 border rounded"
                  >
                    {q.options.map((_, i) => (
                      <option key={i} value={i}>
                        Option {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2">
                  <label className="block font-medium">Explanation</label>
                  <Textarea
                    value={q.explanation || ""}
                    onChange={(e) => {
                      const newQuestions = [...formData.questions];
                      newQuestions[qIndex].explanation = e.target.value;
                      setFormData({ ...formData, questions: newQuestions });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addQuestion}>
              Add Question
            </Button>
            <div className="flex gap-2">
              <Button type="submit">Update Quiz</Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => deleteQuizMutation.mutate()}
              >
                Delete Quiz
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
