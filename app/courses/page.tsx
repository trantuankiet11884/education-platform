"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api";
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
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { Course } from "@/lib/data";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesApi.getAll(1, 5),
  });

  const courses = data?.data || [];

  // Get unique categories safely
  const categories = Array.from<string>(
    new Set(courses.map((course: Course) => course.category).filter(Boolean))
  );

  // Filter courses safely
  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center  max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1  max-w-7xl mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Explore Our Courses
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Browse our catalog of courses and start your learning journey
                  today.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12">
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Icons.logo className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-lg text-red-500">
                    Failed to load courses. Please try again later.
                  </p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No courses found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course: Course) => (
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
                        <CardDescription>
                          {course.shortDescription}
                        </CardDescription>
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
                        <Link
                          href={`/courses/${course._id}`}
                          className="w-full"
                        >
                          <Button className="w-full">View Course</Button>
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
