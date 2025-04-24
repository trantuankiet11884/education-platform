"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
import { Icons } from "@/components/icons";
import { coursesApi } from "@/lib/api";
import { Course } from "@/lib/data";

export function FeaturedCourses() {
  // Sử dụng API thực tế để lấy danh sách khóa học
  const { data: allCourses = [], isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: () => coursesApi.getAll(),
  });

  // Lấy 3 khóa học có số lượng đăng ký cao nhất
  const featuredCourses = allCourses.data
    ?.sort(
      (a: { enrollmentCount: number }, b: { enrollmentCount: number }) =>
        b.enrollmentCount - a.enrollmentCount
    )
    .slice(0, 3);

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Featured Courses
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Explore our most popular courses and start your learning journey
                today.
              </p>
            </div>
          </div>
          <div className="flex justify-center py-12">
            <Icons.logo className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Featured Courses
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Explore our most popular courses and start your learning journey
              today.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg text-muted-foreground">
                No courses available at the moment.
              </p>
            </div>
          ) : (
            featuredCourses.map((course: Course) => (
              <Card
                key={course._id}
                className="flex flex-col overflow-hidden border shadow-sm"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={
                      course.thumbnail ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt={course.title}
                    className="object-cover w-full h-full transition-all hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2">
                    {course.category}
                  </Badge>
                </div>
                <CardHeader className="flex-1">
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Icons.bookOpen className="h-4 w-4" />
                      <span>{course.lessonCount} lessons</span>
                    </div>
                    <div>
                      <span className="font-medium">
                        ${course.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/courses/${course._id}`} className="w-full">
                    <Button className="w-full">View Course</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        <div className="flex justify-center">
          <Link href="/courses">
            <Button variant="outline" size="lg">
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
