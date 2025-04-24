"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { quizzesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";

export default function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch quiz data
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizzesApi.getById(id),
  });

  // Submit quiz attempt mutation
  const submitQuizMutation = useMutation({
    mutationFn: async (quizAttempt: any) => {
      return await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizAttempt),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-quiz-attempts"] });
      toast({
        title: "Quiz submitted",
        description: "Your quiz attempt has been recorded.",
      });
    },
    onError: (error) => {
      console.error("Error submitting quiz attempt:", error);
      toast({
        title: "Error",
        description: "Failed to submit quiz attempt. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (started && quiz && !quizCompleted) {
      const timeLimitInSeconds = (quiz.timeLimit ?? 0) * 60;
      setTimeLeft(timeLimitInSeconds);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [started, quiz, quizCompleted]);

  const startQuiz = () => {
    if (!quiz) return;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or sign up to take this quiz.",
      });
      router.push("/auth/login");
      return;
    }

    setStarted(true);
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const goToNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    if (!quiz) return; // Guard against undefined quiz
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctOption) {
        correctAnswers++;
      }
    });
    const calculatedScore = Math.round(
      (correctAnswers / quiz.questions.length) * 100
    );
    setScore(calculatedScore);
    setQuizCompleted(true);
    // Submit the quiz attempt to the API
    if (user) {
      const quizAttempt = {
        userId: user._id,
        quizId: quiz._id,
        answers: selectedAnswers,
        score: calculatedScore,
        passed: calculatedScore >= quiz.passingScore,
        startedAt: new Date(
          Date.now() - (quiz.timeLimit ?? 0) * 60 * 1000 + timeLeft * 1000
        ),
        completedAt: new Date(),
      };
      submitQuizMutation.mutate(quizAttempt);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading || quizLoading) {
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

  if (!quiz) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Quiz not found</h1>
            <p className="text-muted-foreground">
              The quiz you are looking for does not exist.
            </p>
            <Link href="/quizzes">
              <Button className="mt-4">Browse Quizzes</Button>
            </Link>
          </div>
        </main>
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
      <main className="flex-1 max-w-7xl mx-auto">
        <div className="container py-12">
          {!started ? (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Course:</span>
                    <span>{quiz.courseId?.title || "Standalone Quiz"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Questions:</span>
                    <span>{quiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Time Limit:</span>
                    <span>{quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Passing Score:</span>
                    <span>{quiz.passingScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created By:</span>
                    <span>{quiz.createdBy.name}</span>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Instructions:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      You have {quiz.timeLimit} minutes to complete the quiz.
                    </li>
                    <li>
                      You need to score at least {quiz.passingScore}% to pass.
                    </li>
                    <li>
                      You can navigate between questions using the previous and
                      next buttons.
                    </li>
                    <li>You can review your answers before submitting.</li>
                    <li>
                      Once you submit the quiz, you cannot change your answers.
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={startQuiz}>
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ) : quizCompleted ? (
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Quiz Results</CardTitle>
                <CardDescription>
                  {score >= quiz.passingScore
                    ? "Congratulations! You passed the quiz."
                    : "You did not pass the quiz."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center">
                    <span className="text-3xl font-bold">{score}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Passing Score:</span>
                    <span>{quiz.passingScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Your Score:</span>
                    <span>{score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span
                      className={
                        score >= quiz.passingScore
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {score >= quiz.passingScore ? "Passed" : "Failed"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Review Questions:</h3>
                  {quiz.questions.map((question, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <p className="font-medium mb-2">
                        {index + 1}. {question.text}
                      </p>
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded-md ${
                              selectedAnswers[index] === optionIndex &&
                              optionIndex === question.correctOption
                                ? "bg-green-100 dark:bg-green-900"
                                : selectedAnswers[index] === optionIndex
                                ? "bg-red-100 dark:bg-red-900"
                                : optionIndex === question.correctOption
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-muted"
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctOption && (
                              <span className="ml-2 text-green-600">✓</span>
                            )}
                            {selectedAnswers[index] === optionIndex &&
                              optionIndex !== question.correctOption && (
                                <span className="ml-2 text-red-600">✗</span>
                              )}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="text-sm bg-muted p-2 rounded-md">
                          <span className="font-medium">Explanation:</span>{" "}
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/quizzes")}
                >
                  Back to Quizzes
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{quiz.title}</h1>
                  <p className="text-muted-foreground">
                    Question {currentQuestion + 1} of {quiz.questions.length}
                  </p>
                </div>
                <div className="bg-muted px-4 py-2 rounded-md">
                  <span className="font-medium">Time Left: </span>
                  <span className={timeLeft < 60 ? "text-red-600" : ""}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{quiz.questions[currentQuestion].text}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quiz.questions[currentQuestion].options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedAnswers[currentQuestion] === index
                              ? "default"
                              : "outline"
                          }
                          className="w-full justify-start h-auto py-3 px-4 text-left"
                          onClick={() => selectAnswer(currentQuestion, index)}
                        >
                          {option}
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>

                  {currentQuestion === quiz.questions.length - 1 ? (
                    <Button onClick={submitQuiz}>Submit Quiz</Button>
                  ) : (
                    <Button onClick={goToNextQuestion}>Next</Button>
                  )}
                </CardFooter>
              </Card>

              <div className="mt-6 flex justify-center">
                <div className="flex flex-wrap gap-2 max-w-md">
                  {quiz.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        currentQuestion === index
                          ? "default"
                          : selectedAnswers[index] !== -1
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                      className="w-10 h-10 p-0"
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
