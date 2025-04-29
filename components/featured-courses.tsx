"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { coursesApi } from "@/lib/api";
import { Course } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CardCourse from "./course/card-course";

export function FeaturedCourses() {
  const { data: allCourses = [], isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: () => coursesApi.getAll(),
  });

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
              <CardCourse key={course._id} course={course} />
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
