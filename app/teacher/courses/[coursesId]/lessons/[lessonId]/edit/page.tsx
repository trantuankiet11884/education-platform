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
import { lessonsApi, coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

// Import interfaces
import { Course, Lesson } from "@/lib/data"; // Adjust path if needed

export default function EditLessonPage({
  params,
}: {
  params: Promise<{ coursesId: string; lessonId: string }>;
}) {
  const { user, loading: authLoading } = useAuth();
  const { coursesId, lessonId } = React.use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("0");
  const [order, setOrder] = useState("0");
  const [isFree, setIsFree] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Fetch lesson details
  const {
    data: lesson,
    isLoading: lessonLoading,
  }: UseQueryResult<Lesson, Error> = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonsApi.getById(lessonId as string),
    enabled: !!lessonId,
  });

  // Fetch course details to verify ownership
  const {
    data: course,
    isLoading: courseLoading,
  }: UseQueryResult<Course, Error> = useQuery({
    queryKey: ["course", coursesId],
    queryFn: () => coursesApi.getById(coursesId as string),
    enabled: !!coursesId,
  });

  // Update state when lesson data is fetched
  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setDescription(lesson.description);
      setContent(lesson.content);
      setVideoUrl(lesson.videoUrl || "");
      setDuration(lesson.duration.toString());
      setOrder(lesson.order.toString());
      setIsFree(lesson.isFree);
      setIsPublished(lesson.isPublished);
    }
  }, [lesson]);

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

  // Update lesson mutation
  const updateLessonMutation: UseMutationResult<Lesson, Error, any> =
    useMutation({
      mutationFn: async (lessonData: any) =>
        await lessonsApi.update(lessonId as string, lessonData),
      onSuccess: () => {
        toast({
          title: "Lesson updated",
          description: "Your lesson has been updated successfully.",
        });
        router.push(`/teacher/courses/${coursesId}`);
      },
      onError: (error) => {
        console.error("Error updating lesson:", error);
        toast({
          title: "Error",
          description: "Failed to update lesson.",
          variant: "destructive",
        });
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const lessonData = {
      courseId: coursesId,
      title,
      description,
      content,
      videoUrl: videoUrl || undefined,
      duration: Number.parseInt(duration),
      order: Number.parseInt(order),
      isFree,
      isPublished,
      updatedAt: new Date().toISOString(),
    };

    updateLessonMutation.mutate(lessonData);
  };

  if (authLoading || lessonLoading || courseLoading) {
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
                Edit Lesson: {lesson?.title || "Loading..."}
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
                  <CardTitle>Lesson Information</CardTitle>
                  <CardDescription>
                    Update the details of your lesson
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">Video URL (optional)</Label>
                      <Input
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="e.g., https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="0"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order">Order *</Label>
                      <Input
                        id="order"
                        type="number"
                        min="0"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFree"
                        checked={isFree}
                        onCheckedChange={setIsFree}
                      />
                      <Label htmlFor="isFree">Free lesson</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublished"
                        checked={isPublished}
                        onCheckedChange={setIsPublished}
                      />
                      <Label htmlFor="isPublished">Publish immediately</Label>
                    </div>
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
                    disabled={updateLessonMutation.isPending}
                  >
                    {updateLessonMutation.isPending ? (
                      <>
                        <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Lesson"
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
