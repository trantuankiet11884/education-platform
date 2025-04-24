"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NewCoursePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }

    if (!loading && user && user.role !== "teacher" && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      return await coursesApi.create(courseData);
    },
    onSuccess: (data) => {
      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      });
      router.push(`/teacher/courses/${data._id}/lessons/new`);
    },
    onError: (error) => {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
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
      instructor: user?._id,
      category,
      level,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createCourseMutation.mutate(courseData);
  };

  if (loading) {
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

  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    return null; // Redirect handled in useEffect
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
              <div>
                <h1 className="text-3xl font-bold">Create New Course</h1>
                <p className="text-muted-foreground">
                  Fill in the details to create a new course
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/teacher/dashboard")}
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>
                    Provide the basic information about your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Complete Web Development Bootcamp"
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
                      placeholder="A brief description of your course (1-2 sentences)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed description of your course"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Web Development"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
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
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g., 49.99"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., HTML, CSS, JavaScript"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                    <Label htmlFor="published">
                      Publish course immediately
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/teacher/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCourseMutation.isPending}
                  >
                    {createCourseMutation.isPending ? (
                      <>
                        <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Course"
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
