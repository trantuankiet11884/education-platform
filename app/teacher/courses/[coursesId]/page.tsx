"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { coursesApi, lessonsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-provider";

export default function TeacherCourseDetailPage({
  params,
}: {
  params: Promise<{ coursesId: string }>;
}) {
  const { coursesId } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", coursesId],
    queryFn: () => coursesApi.getById(coursesId as string),
    enabled: !!coursesId,
  });

  // Fetch lessons
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", coursesId],
    queryFn: () => lessonsApi.getByCourseId(coursesId as string),
    enabled: !!coursesId,
  });

  // Check authentication and role
  if (authLoading) {
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
        <Footer />
      </div>
    );
  }

  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    router.push("/auth/login");
    return null;
  }

  if (courseLoading || lessonsLoading) {
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
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Course not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (user._id !== course.instructor._id && user.role !== "admin") {
    router.push("/teacher/dashboard");
    return null;
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
          <section className="mb-12">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-lg text-muted-foreground">
                  {course.shortDescription}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/teacher/courses/${coursesId}/edit`)
                  }
                >
                  Edit Course
                </Button>
                <Button
                  onClick={() =>
                    router.push(`/teacher/courses/${coursesId}/lessons/new`)
                  }
                >
                  Add Lesson
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant={course.isPublished ? "default" : "destructive"}>
                {course.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap mb-6">
                    {course.description}
                  </p>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Tags</h3>
                      <div className="flex gap-2 mt-2">
                        {course.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Lessons</h3>
                      <p>{course.lessonCount} lessons</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Total Duration</h3>
                      <p>{course.duration} minutes</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Price</h3>
                      <p>${course.price.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lessons Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  {lessons && lessons.length > 0 ? (
                    <div className="space-y-4">
                      {lessons.map((lesson: any) => (
                        <div
                          key={lesson._id}
                          className="flex justify-between items-center p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {lesson.description}
                            </p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">
                                Order: {lesson.order}
                              </Badge>
                              <Badge variant="outline">
                                {lesson.duration} min
                              </Badge>
                              {lesson.isFree && (
                                <Badge variant="secondary">Free</Badge>
                              )}
                              <Badge
                                variant={
                                  lesson.isPublished ? "default" : "destructive"
                                }
                              >
                                {lesson.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/teacher/courses/${coursesId}/lessons/${lesson._id}/edit`
                                )
                              }
                            >
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No lessons yet. Add a lesson to get started!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="font-semibold">Instructor</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar>
                          <AvatarImage src={course.instructor.avatar} />
                          <AvatarFallback>
                            {course.instructor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {course.instructor.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {course.instructor.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Course Stats</h3>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="font-medium">Enrollments:</span>{" "}
                          {course.enrollmentCount}
                        </p>
                        <p>
                          <span className="font-medium">Rating:</span>{" "}
                          {course.rating}/5
                        </p>
                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
