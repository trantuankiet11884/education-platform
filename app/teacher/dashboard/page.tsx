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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-provider";
import { Course } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }

    if (!loading && user && user.role !== "teacher") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Fetch teacher's courses from the API
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["teacher-courses", user?._id],
    queryFn: async () => {
      const response = await axios.get(`/api/courses/instructor/${user?._id}`);
      return response.data.data || [];
    },
    enabled: !!user && user.role === "teacher",
  });

  if (loading || isLoading) {
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

  if (!user || user.role !== "teacher") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 p-2 container mx-auto">
        <div className="container py-12 mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your courses and students
                </p>
              </div>
              <Link href={"/teacher/courses/new"}>
                <Button>Create New Course</Button>
              </Link>
            </div>

            <Tabs defaultValue="courses">
              <TabsList>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="courses" className="mt-6">
                {courses.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold">
                      You haven't created any courses yet
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Create your first course to get started
                    </p>
                    <Link href={"/teacher/courses/new"}>
                      <Button className="mt-4">Create New Course</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course: Course) => (
                      <Card key={course._id} className="flex flex-col">
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={
                              course.thumbnail ||
                              "/placeholder.svg?height=200&width=300"
                            }
                            alt={course.title}
                            className="object-cover w-full h-full"
                          />
                          <Badge className="absolute top-2 right-2">
                            {course.category}
                          </Badge>
                        </div>
                        <CardHeader>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>
                            {course.isPublished ? "Published" : "Draft"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Students</p>
                              <p className="font-medium">
                                {course.enrollmentCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Rating</p>
                              <p className="font-medium">
                                {course.rating.toFixed(1)}/5
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Lessons</p>
                              <p className="font-medium">
                                {course.lessonCount}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Price</p>
                              <p className="font-medium">
                                ${course.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() =>
                              router.push(
                                `/teacher/courses/${course._id}/lessons/new`
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() =>
                              router.push(`/teacher/courses/${course._id}`)
                            }
                          >
                            View
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="students" className="mt-6">
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold">Student Management</h2>
                  <p className="text-muted-foreground mt-2">
                    View and manage your students
                  </p>
                  <Button className="mt-4">View All Students</Button>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-6">
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold">Course Analytics</h2>
                  <p className="text-muted-foreground mt-2">
                    View insights about your courses
                  </p>
                  <Button className="mt-4">View Detailed Analytics</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
