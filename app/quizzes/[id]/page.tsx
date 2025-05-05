"use client";

import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { quizzesApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Award, Book, Clock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  const getTimeLeftColor = () => {
    if (!quiz) return "text-primary";
    const totalTime = (quiz.timeLimit ?? 0) * 60;
    const percentageLeft = (timeLeft / totalTime) * 100;

    if (percentageLeft <= 10) return "text-red-600 font-bold animate-pulse";
    if (percentageLeft <= 25) return "text-amber-600";
    return "text-primary";
  };

  const getProgressPercentage = () => {
    if (!quiz) return 0;
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
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
          <div className="text-center space-y-4">
            <Icons.logo className="h-12 w-12 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
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
          <div className="text-center max-w-md p-6 rounded-lg bg-muted/50">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Quiz not found</h1>
            <p className="text-muted-foreground mb-6">
              The quiz you are looking for does not exist or may have been
              removed.
            </p>
            <Link href="/quizzes">
              <Button className="w-full">Browse Available Quizzes</Button>
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
      <main className="flex-1 w-full bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 md:py-12 max-w-7xl mx-auto px-2">
          {!started ? (
            <Card className="max-w-3xl mx-auto shadow-lg border-t-4 border-t-primary">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Quiz Details</h3>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Course:</span>
                        <span className="font-medium">
                          {quiz.courseId?.title || "Standalone Quiz"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Questions:
                        </span>
                        <Badge variant="outline">{quiz.questions.length}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Time Limit:
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.timeLimit} minutes</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Passing Score:
                        </span>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>{quiz.passingScore}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Created By:
                        </span>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{quiz.createdBy.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Instructions</h3>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            You have <strong>{quiz.timeLimit} minutes</strong>{" "}
                            to complete the quiz.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            You need to score at least{" "}
                            <strong>{quiz.passingScore}%</strong> to pass.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            You can navigate between questions using the
                            navigation buttons.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            You can review your answers before submitting.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Once submitted, you cannot change your answers.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full py-6 text-lg font-semibold"
                  onClick={startQuiz}
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ) : quizCompleted ? (
            <Card className="max-w-3xl mx-auto shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  Quiz Results
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {score >= quiz.passingScore
                    ? "Congratulations! You've successfully passed the quiz."
                    : "You didn't pass this time. Review the feedback and try again."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <svg className="w-40 h-40">
                      <circle
                        className="text-muted"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="64"
                        cx="80"
                        cy="80"
                      />
                      <circle
                        className={
                          score >= quiz.passingScore
                            ? "text-green-500"
                            : "text-red-500"
                        }
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="64"
                        cx="80"
                        cy="80"
                        strokeDasharray={`${2 * Math.PI * 64}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 64 * (1 - score / 100)
                        }`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-4xl font-bold">{score}%</div>
                      <div className="text-sm text-muted-foreground">
                        Your Score
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Passing Score
                    </div>
                    <div className="text-xl font-semibold">
                      {quiz.passingScore}%
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Your Score
                    </div>
                    <div className="text-xl font-semibold">{score}%</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      score >= quiz.passingScore
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
                    }`}
                  >
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div
                      className={`text-xl font-semibold ${
                        score >= quiz.passingScore
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {score >= quiz.passingScore ? "PASSED" : "FAILED"}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Question Review
                  </h3>

                  {quiz.questions.map((question, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-muted/50 p-4">
                        <p className="font-medium">
                          <span className="text-primary font-bold mr-2">
                            Q{index + 1}.
                          </span>
                          {question.text}
                        </p>
                      </div>
                      <div className="p-4 space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isSelected =
                            selectedAnswers[index] === optionIndex;
                          const isCorrect =
                            optionIndex === question.correctOption;

                          let bgClass = "bg-muted/30";
                          if (isSelected && isCorrect)
                            bgClass = "bg-green-100 dark:bg-green-900/30";
                          else if (isSelected)
                            bgClass = "bg-red-100 dark:bg-red-900/30";
                          else if (isCorrect)
                            bgClass = "bg-green-100 dark:bg-green-900/30";

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-md flex justify-between items-center ${bgClass}`}
                            >
                              <span>{option}</span>
                              {isCorrect && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                >
                                  Correct Answer
                                </Badge>
                              )}
                              {isSelected && !isCorrect && (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                >
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {question.explanation && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-t">
                          <p className="text-sm">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Link href={"/quizzes"} className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">
                    Browse More Quizzes
                  </Button>
                </Link>
                <Link href={"/"} className="w-full sm:w-auto">
                  <Button className="w-full">Back to Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <div className="container max-w-7xl mx-auto">
              <div className="bg-background rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{quiz.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </span>
                    <Progress
                      value={getProgressPercentage()}
                      className="w-24 h-2"
                    />
                  </div>
                </div>
                <div
                  className={`${getTimeLeftColor()} flex items-center gap-2 text-lg font-medium bg-muted/50 px-4 py-2 rounded-full`}
                >
                  <Clock className="h-5 w-5" />
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Quiz Content - Left Side (75% width) */}
                <div className="lg:col-span-3">
                  <Card className="shadow-lg h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl leading-tight">
                        <span className="text-primary font-bold mr-2">
                          Q{currentQuestion + 1}.
                        </span>
                        {quiz.questions[currentQuestion].text}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {quiz.questions[currentQuestion].options.map(
                          (option, index) => (
                            <Button
                              key={index}
                              variant={
                                selectedAnswers[currentQuestion] === index
                                  ? "default"
                                  : "outline"
                              }
                              className={`w-full justify-start h-auto py-4 px-5 text-left transition-all ${
                                selectedAnswers[currentQuestion] === index
                                  ? "shadow-md"
                                  : "hover:bg-muted/50"
                              }`}
                              onClick={() =>
                                selectAnswer(currentQuestion, index)
                              }
                            >
                              <span className="font-medium mr-3">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              {option}
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-4 mt-auto">
                      <Button
                        variant="outline"
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestion === 0}
                        className="min-w-24"
                      >
                        Previous
                      </Button>

                      {currentQuestion === quiz.questions.length - 1 ? (
                        <Button
                          onClick={submitQuiz}
                          className="min-w-24 bg-green-600 hover:bg-green-700"
                        >
                          Submit Quiz
                        </Button>
                      ) : (
                        <Button onClick={goToNextQuestion} className="min-w-24">
                          Next
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>

                {/* Question Navigator - Right Side (25% width) */}
                <div className="lg:col-span-1">
                  <div className="bg-background rounded-lg shadow-lg p-4 sticky top-20">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Question Navigator
                    </h3>
                    <div className="grid grid-cols-4 lg:grid-cols-3 gap-2">
                      {quiz.questions.map((_, index) => {
                        let buttonVariant = "outline";
                        if (currentQuestion === index)
                          buttonVariant = "default";
                        else if (selectedAnswers[index] !== -1)
                          buttonVariant = "secondary";

                        return (
                          <Button
                            key={index}
                            variant={buttonVariant as any}
                            size="sm"
                            className={`w-full h-10 p-0 ${
                              selectedAnswers[index] !== -1 &&
                              currentQuestion !== index
                                ? "!border-green-500 !dark:border-green-600"
                                : ""
                            }`}
                            onClick={() => setCurrentQuestion(index)}
                          >
                            {index + 1}
                          </Button>
                        );
                      })}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        Quiz Progress
                      </h3>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Completion</span>
                          <span>{Math.round(getProgressPercentage())}%</span>
                        </div>
                        <Progress
                          value={getProgressPercentage()}
                          className="h-2"
                        />
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Answered</span>
                          <span>
                            {selectedAnswers.filter((a) => a !== -1).length} /{" "}
                            {quiz.questions.length}
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedAnswers.filter((a) => a !== -1).length /
                              quiz.questions.length) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
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
