"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { quizzesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useAuth } from "@/lib/auth-provider";
import Link from "next/link";

export default function QuizDetailPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = React.use(params);
  const { user, loading } = useAuth();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizzesApi.getById(quizId),
    enabled: !!user && user.role === "teacher",
  });

  if (loading || isLoading) {
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
    return <p>Access denied. Only teachers can view this page.</p>;
  }

  if (!quiz) {
    return <p>Quiz not found.</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto">
        <div className="container py-6">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{quiz.description}</p>
              <p className="mt-2">Questions: {quiz.questions.length}</p>
              <p>Time Limit: {quiz.timeLimit} minutes</p>
              <p>Passing Score: {quiz.passingScore}%</p>
              <p>Created By: {quiz.createdBy.name}</p>
              <div className="mt-4">
                <h3 className="font-medium">Questions:</h3>
                {quiz.questions.map((q, index) => (
                  <div key={index} className="mt-2">
                    <p>
                      {index + 1}. {q.text}
                    </p>
                    <ul className="list-disc ml-6">
                      {q.options.map((option, i) => (
                        <li
                          key={i}
                          className={
                            i === q.correctOption ? "text-green-600" : ""
                          }
                        >
                          {option} {i === q.correctOption && "(Correct)"}
                        </li>
                      ))}
                    </ul>
                    {q.explanation && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="flex gap-2 p-6">
              <Link href="/teacher/quizzes">
                <Button variant="outline">Back to Quizzes</Button>
              </Link>
              <Link href={`/teacher/quizzes/edit/${quiz._id}`}>
                <Button>Edit Quiz</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
