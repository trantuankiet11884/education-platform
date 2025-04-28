"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { lessonsApi, coursesApi, enrollmentsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";

export default function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = React.use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesApi.getById(courseId),
    enabled: !!courseId,
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => lessonsApi.getByCourseId(courseId),
    enabled: !!courseId,
  });

  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment", user?._id, courseId],
    queryFn: () =>
      enrollmentsApi.getByUserId(user?._id || "").then((enrollments) => {
        const found = enrollments.find((e) => {
          if (typeof e.courseId === "string") {
            return e.courseId === courseId;
          }
          if (e.courseId && typeof e.courseId === "object" && e.courseId._id) {
            return e.courseId._id === courseId;
          }
          return false;
        });
        return found;
      }),
    enabled: !!user && !!courseId,
  });

  useEffect(() => {
    if (lessons.length > 0 && !activeLesson) {
      setActiveLesson(lessons[0]._id);
    }
  }, [lessons, activeLesson]);

  const updateProgressMutation = useMutation({
    mutationFn: ({
      lessonId,
      enrollmentId,
    }: {
      lessonId: string;
      enrollmentId: string;
    }) => {
      const completedLessons = [
        ...(enrollment?.completedLessons || []),
        lessonId,
      ];
      const progress = Math.round(
        (completedLessons.length / lessons.length) * 100
      );
      return enrollmentsApi.updateProgress(
        enrollmentId,
        progress,
        completedLessons
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["enrollment", user?._id, courseId], data);
      toast({
        title: "Progress updated",
        description: "Your progress has been saved.",
      });
    },
  });

  const markAsComplete = (lessonId: string) => {
    if (!user) {
      console.log("No user found");
      return;
    }
    if (!enrollment) {
      console.log("No enrollment found for course:", courseId);
      return;
    }

    if (enrollment.completedLessons?.includes(lessonId)) {
      toast({
        title: "Already completed",
        description: "You've already completed this lesson.",
      });
      return;
    }

    updateProgressMutation.mutate({
      lessonId,
      enrollmentId: enrollment._id,
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const isLoading =
    loading || courseLoading || lessonsLoading || enrollmentLoading;

  // Hàm xác định loại video và trả về JSX phù hợp
  const renderVideoPlayer = (videoUrl: string) => {
    // Kiểm tra URL YouTube
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.includes("v=")
        ? videoUrl.split("v=")[1]?.split("&")[0]
        : videoUrl.split("/").pop();
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return (
        <iframe
          src={embedUrl}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
        />
      );
    }

    // Kiểm tra URL Vimeo (nếu có trong tương lai)
    if (videoUrl.includes("vimeo.com")) {
      const videoId = videoUrl.split("/").pop();
      const embedUrl = `https://player.vimeo.com/video/${videoId}`;
      return (
        <iframe
          src={embedUrl}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md"
        />
      );
    }

    // Mặc định cho các định dạng video trực tiếp (MP4, WebM, v.v.)
    return (
      <video
        src={videoUrl}
        controls
        autoPlay
        className="w-full h-full rounded-md"
      />
    );
  };

  if (isLoading) {
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

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Course not found</h1>
            <p className="text-muted-foreground">
              The course you are looking for does not exist.
            </p>
            <Link href="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const activeLeasonData = lessons.find(
    (lesson) => lesson._id === activeLesson
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 p-2">
        <div className="container py-6">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:underline"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold mt-2">{course.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={enrollment?.progress || 0} className="w-48" />
              <span className="text-sm text-muted-foreground">
                {enrollment?.progress || 0}% complete
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="space-y-4">
              <div className="font-medium">Course Content</div>
              <div className="space-y-1">
                {lessons.map((lesson, index) => {
                  const isCompleted = enrollment?.completedLessons?.includes(
                    lesson._id
                  );
                  const isActive = activeLesson === lesson._id;

                  return (
                    <Button
                      key={lesson._id}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveLesson(lesson._id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-black">
                          {isCompleted ? "✓" : index + 1}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              {activeLeasonData ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{activeLeasonData.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeLeasonData.videoUrl && (
                        <div className="aspect-video bg-muted rounded-md mb-4">
                          {renderVideoPlayer(activeLeasonData.videoUrl)}
                        </div>
                      )}
                      <div className="prose dark:prose-invert max-w-none">
                        <p>{activeLeasonData.content}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentIndex = lessons.findIndex(
                          (l) => l._id === activeLesson
                        );
                        if (currentIndex > 0) {
                          setActiveLesson(lessons[currentIndex - 1]._id);
                        }
                      }}
                      disabled={
                        lessons.findIndex((l) => l._id === activeLesson) === 0
                      }
                    >
                      Previous Lesson
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          markAsComplete(activeLeasonData._id);
                        }}
                        disabled={enrollment?.completedLessons?.includes(
                          activeLeasonData._id
                        )}
                      >
                        {enrollment?.completedLessons?.includes(
                          activeLeasonData._id
                        )
                          ? "Completed"
                          : "Mark as Complete"}
                      </Button>

                      <Button
                        variant="default"
                        onClick={() => {
                          const currentIndex = lessons.findIndex(
                            (l) => l._id === activeLesson
                          );
                          if (currentIndex < lessons.length - 1) {
                            setActiveLesson(lessons[currentIndex + 1]._id);
                          }
                        }}
                        disabled={
                          lessons.findIndex((l) => l._id === activeLesson) ===
                          lessons.length - 1
                        }
                      >
                        Next Lesson
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">
                    Select a lesson to start learning
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
