"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";

export default function QuizzesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");

  // Sử dụng API thực tế
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: quizzesApi.getAll,
  });

  // Get unique courses
  const courses = Array.from(
    new Set(quizzes.map((quiz) => quiz.courseId?.title).filter(Boolean))
  );

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || quiz.courseId?.title === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Online Quizzes
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Test your knowledge with our interactive quizzes and track
                  your progress.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Input
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course || ""}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Icons.logo className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No quizzes found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredQuizzes.map((quiz) => (
                    <Card key={quiz._id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle>{quiz.title}</CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Course:
                            </span>
                            <span>
                              {quiz.courseId?.title || "Standalone Quiz"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Questions:
                            </span>
                            <span>{quiz.questions.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Time Limit:
                            </span>
                            <span>{quiz.timeLimit} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Passing Score:
                            </span>
                            <span>{quiz.passingScore}%</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/quizzes/${quiz._id}`} className="w-full">
                          <Button className="w-full">Take Quiz</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
