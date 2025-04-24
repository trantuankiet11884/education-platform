"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Course } from "@/lib/data";

// Import interfaces

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ coursesId: string }>;
}) {
  const { coursesId } = React.use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner"
  );
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  // Fetch course details with proper typing
  const {
    data: course,
    isLoading: courseLoading,
  }: UseQueryResult<Course, Error> = useQuery({
    queryKey: ["course", coursesId],
    queryFn: () => coursesApi.getById(coursesId as string),
    enabled: !!coursesId,
  });

  // Update state when course data is fetched
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setShortDescription(course.shortDescription);
      setDescription(course.description);
      setPrice(course.price.toString());
      setCategory(course.category);
      setLevel(course.level);
      setTags(course.tags.join(", "));
      setIsPublished(course.isPublished || false);
    }
  }, [course]);

  // Check authentication and role
  useEffect(() => {
    if (!authLoading && !user) router.push("/auth/login");
    if (
      !authLoading &&
      user &&
      user.role !== "teacher" &&
      user.role !== "admin"
    )
      router.push("/dashboard");
    if (
      !authLoading &&
      course &&
      user?._id !== course.instructor._id &&
      user?.role !== "admin"
    ) {
      router.push("/teacher/dashboard");
    }
  }, [user, authLoading, course, router]);

  // Update course mutation with proper typing (expecting Course as return type)
  const updateCourseMutation: UseMutationResult<Course, Error, any> =
    useMutation({
      mutationFn: async (courseData: any) =>
        await coursesApi.update(coursesId as string, courseData),
      onSuccess: () => {
        toast({
          title: "Course updated",
          description: "Your course has been updated successfully.",
        });
        router.push(`/teacher/courses/${coursesId}`);
      },
      onError: (error) => {
        console.error("Error updating course:", error);
        toast({
          title: "Error",
          description: "Failed to update course.",
          variant: "destructive",
        });
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !shortDescription || !description || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const courseData = {
      title,
      slug: title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
      shortDescription,
      description,
      price: Number.parseFloat(price),
      category,
      level,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isPublished,
      updatedAt: new Date().toISOString(),
    };

    updateCourseMutation.mutate(courseData);
  };

  if (authLoading || courseLoading) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto">
        <div className="container py-12">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                Edit Course: {course?.title || "Loading..."}
              </h1>
              <Button
                variant="outline"
                onClick={() => router.push(`/teacher/courses/${coursesId}`)}
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>
                    Update the details of your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">
                      Short Description *
                    </Label>
                    <Input
                      id="shortDescription"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select
                        value={level}
                        onValueChange={(
                          value: "beginner" | "intermediate" | "advanced"
                        ) => setLevel(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                    <Label htmlFor="published">Publish course</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push(`/teacher/courses/${coursesId}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCourseMutation.isPending}
                  >
                    {updateCourseMutation.isPending ? (
                      <>
                        <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Course"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
