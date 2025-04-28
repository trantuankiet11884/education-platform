"use client";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi, lessonsApi, enrollmentsApi, reviewsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import TabsOverview from "@/components/tabs/tab-overview";
import TabsCurriculum from "@/components/tabs/tab-curriculum";
import TabsInstructor from "@/components/tabs/tabs-instructor";
import TabsReviews from "@/components/tabs/tabs-reviews";
import { Review } from "@/lib/data";

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesApi.getById(id),
  });

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons", id],
    queryFn: () => lessonsApi.getByCourseId(id),
    enabled: !!course,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewsApi.getByCourseId(id),
    enabled: !!course,
  });

  // Check if user is enrolled
  const { data: userEnrollments = [], isLoading: enrollmentsLoading } =
    useQuery({
      queryKey: ["user-enrollments", user?._id],
      queryFn: () => enrollmentsApi.getByUserId(user?._id || ""),
      enabled: !!user,
    });

  const isEnrolled = userEnrollments.some((enrollment) =>
    typeof enrollment.courseId === "string"
      ? enrollment.courseId === id
      : enrollment.courseId?._id === id
  );

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user || !course) throw new Error("User or course not found");
      return await enrollmentsApi.create({
        userId: user._id,
        courseId: course._id,
        startDate: new Date().toISOString(),
        lastAccessDate: new Date().toISOString(),
        progress: 0,
        completedLessons: [],
        isCompleted: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-enrollments"] });
      toast({
        title: "Enrolled successfully",
        description: `You have been enrolled in ${course?.title}.`,
      });
      router.push(`/learn/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      if (!user || !course) throw new Error("User or course not found");
      return await reviewsApi.create({
        userId: {
          _id: user?._id,
          name: user?.name,
          avatar: user?.avatar || "",
        },
        courseId: course._id,
        rating: data.rating,
        comment: data.comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      toast({
        title: "Review submitted",
        description: "Your review has been successfully submitted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    },
  });

  // Update review mutation
  const updateReviewMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { rating: number; comment: string };
    }) => {
      if (!user || !course) throw new Error("User or course not found");
      return await reviewsApi.update(id, {
        userId: {
          _id: user?._id,
          name: user?.name,
          avatar: user?.avatar || "",
        },

        courseId: course._id,
        rating: data.rating,
        comment: data.comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      toast({
        title: "Review updated",
        description: "Your review has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update review.",
        variant: "destructive",
      });
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not found");
      return await reviewsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review.",
        variant: "destructive",
      });
    },
  });

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or sign up to enroll in this course.",
      });
      router.push("/auth/login");
      return;
    }
    if (isEnrolled) {
      router.push(`/learn/${id}`);
      return;
    }
    enrollMutation.mutate();
  };

  const isLoading =
    courseLoading || lessonsLoading || enrollmentsLoading || reviewsLoading;

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
            <Link href="/courses">
              <Button className="mt-4">Browse Courses</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const userReview = reviews.find(
    (review) => review?.userId?._id === user?._id
  );

  const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={
                      course.thumbnail ||
                      "/placeholder.svg?height=400&width=800"
                    }
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-6">
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <div className="mt-4 text-muted-foreground">
                    <p>
                      Instructor:{" "}
                      {course.instructor?.name || "Unknown Instructor"}
                    </p>
                    <p>
                      Last updated:{" "}
                      {new Date(course.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="mt-8">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsOverview course={course} />
                  <TabsCurriculum course={course} lessons={lessons} />
                  <TabsInstructor course={course} />
                  <TabsReviews
                    reviews={reviews}
                    isEnrolled={isEnrolled}
                    user={user}
                    userReview={userReview}
                    courseId={id}
                    createReviewMutation={createReviewMutation}
                    updateReviewMutation={updateReviewMutation}
                    deleteReviewMutation={deleteReviewMutation}
                  />
                </Tabs>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {course.price === 0
                        ? "Course is Free"
                        : `$${course.price.toFixed(2)}`}
                    </CardTitle>
                    <CardDescription>
                      Get full access to this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icons.bookOpen className="h-4 w-4" />
                        <span>{course.lessonCount} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⭐</span>
                        <span>
                          {calculateAverageRating(reviews)} ({reviews.length}{" "}
                          {reviews.length === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span>{course.enrollmentCount} students enrolled</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    {course.price > 0 &&
                      !user?.purchasedCourses?.includes(course._id) && (
                        <Link
                          href={`/payment/${course._id}`}
                          className="w-full"
                        >
                          <Button className="w-full" variant="outline">
                            Buy Now
                          </Button>
                        </Link>
                      )}
                    <Button
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? (
                        <>
                          <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                          Enrolling...
                        </>
                      ) : isEnrolled ? (
                        "Continue Learning"
                      ) : (
                        "Enroll Now"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
