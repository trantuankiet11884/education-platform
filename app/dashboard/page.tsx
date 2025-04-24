"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { quizAttemptsApi } from "@/lib/api"; // Import API mới
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";

export default function QuizHistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const {
    data: quizAttempts = [],
    isLoading: attemptsLoading,
    error,
  } = useQuery({
    queryKey: ["user-quiz-attempts", user?._id],
    queryFn: () => quizAttemptsApi.getByUserId(user?._id || ""),
    enabled: !!user,
  });

  const isLoading = loading || attemptsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  // Xử lý lỗi từ API
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">
              Error Loading Quiz History
            </h2>
            <p className="text-muted-foreground">
              Something went wrong while fetching your quiz attempts. Please try
              again later.
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 p-2">
        <div className="container py-12">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Quiz History</h1>
                <p className="text-muted-foreground">
                  View your quiz attempts and results
                </p>
              </div>
              <Link href="/quizzes">
                <Button>Take New Quiz</Button>
              </Link>
            </div>

            {Array.isArray(quizAttempts) && quizAttempts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-semibold">
                      No Quiz Attempts Yet
                    </h2>
                    <p className="text-muted-foreground">
                      You haven't taken any quizzes yet. Start testing your
                      knowledge!
                    </p>
                    <Link href="/quizzes">
                      <Button>Browse Quizzes</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(quizAttempts) &&
                  quizAttempts.map((attempt: any) => (
                    <Card key={attempt._id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle>{attempt.quizId?.title || "Quiz"}</CardTitle>
                        <CardDescription>
                          Attempted on{" "}
                          {new Date(attempt.completedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Score:</span>
                            <span className="text-lg">{attempt.score}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Status:</span>
                            <Badge
                              variant={attempt.passed ? "default" : "outline"}
                            >
                              {attempt.passed ? "Passed" : "Failed"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Time Taken:</span>
                            <span>
                              {Math.round(
                                (new Date(attempt.completedAt).getTime() -
                                  new Date(attempt.startedAt).getTime()) /
                                  60000
                              )}{" "}
                              minutes
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link
                          href={`/quizzes/${
                            attempt.quizId?._id || attempt.quizId
                          }`}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full">
                            Retake Quiz
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
