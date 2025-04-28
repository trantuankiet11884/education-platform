"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { quizzesApi, coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { Course } from "@/lib/data";
import { Icons } from "@/components/icons";

export default function CreateQuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    courseId: "",
    timeLimit: 0,
    passingScore: 0,
    questions: [
      {
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
        explanation: "",
      },
    ],
  });

  // Sửa lại cách gán dữ liệu từ useQuery
  const { data: coursesData = { data: [] } } = useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesApi.getAll(),
    enabled: !!user && user.role === "teacher",
  });

  const createQuizMutation = useMutation({
    mutationFn: (newQuiz: any) =>
      quizzesApi.create({ ...newQuiz, createdBy: user?._id }),
    onSuccess: () => {
      toast({ title: "Quiz created successfully" });
      router.push("/teacher/quizzes");
    },
    onError: (error) => {
      toast({
        title: "Error creating quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuizMutation.mutate(quiz);
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: "",
          options: ["", "", "", ""],
          correctOption: 0,
          explanation: "",
        },
      ],
    });
  };

  if (loading) {
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
    return <p>Access denied. Only teachers can create quizzes.</p>;
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
          <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            <div>
              <label className="block font-medium">Title</label>
              <Input
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-medium">Description</label>
              <Textarea
                value={quiz.description}
                onChange={(e) =>
                  setQuiz({ ...quiz, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block font-medium">Course</label>
              <select
                value={quiz.courseId}
                onChange={(e) => setQuiz({ ...quiz, courseId: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a course (optional)</option>
                {/* Sửa courses.courses thành coursesData.data */}
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
                value={quiz.timeLimit}
                onChange={(e) =>
                  setQuiz({ ...quiz, timeLimit: Number(e.target.value) })
                }
                min="0"
              />
            </div>
            <div>
              <label className="block font-medium">Passing Score (%)</label>
              <Input
                type="number"
                value={quiz.passingScore}
                onChange={(e) =>
                  setQuiz({ ...quiz, passingScore: Number(e.target.value) })
                }
                min="0"
                max="100"
              />
            </div>
            {quiz.questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded">
                <label className="block font-medium">
                  Question {qIndex + 1}
                </label>
                <Input
                  value={q.text}
                  onChange={(e) => {
                    const newQuestions = [...quiz.questions];
                    newQuestions[qIndex].text = e.target.value;
                    setQuiz({ ...quiz, questions: newQuestions });
                  }}
                  placeholder="Question text"
                  required
                />
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="mt-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newQuestions = [...quiz.questions];
                        newQuestions[qIndex].options[oIndex] = e.target.value;
                        setQuiz({ ...quiz, questions: newQuestions });
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
                      const newQuestions = [...quiz.questions];
                      newQuestions[qIndex].correctOption = Number(
                        e.target.value
                      );
                      setQuiz({ ...quiz, questions: newQuestions });
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
                    value={q.explanation}
                    onChange={(e) => {
                      const newQuestions = [...quiz.questions];
                      newQuestions[qIndex].explanation = e.target.value;
                      setQuiz({ ...quiz, questions: newQuestions });
                    }}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addQuestion}>
              Add Question
            </Button>
            <Button type="submit" className="ml-2">
              Create Quiz
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
