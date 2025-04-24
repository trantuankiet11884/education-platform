"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Course } from "@/lib/data";

export default function AdminCoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }

    if (!loading && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Fetch courses with pagination
  interface CoursesData {
    courses: Course[];
    totalCourses: number;
    totalPages: number;
    categories: string[];
  }

  const { data: coursesData, isLoading: coursesLoading } =
    useQuery<CoursesData>({
      queryKey: [
        "admin-courses",
        page,
        pageSize,
        searchTerm,
        categoryFilter,
        levelFilter,
      ],
      queryFn: async () => {
        const response = await coursesApi.getAll(page, pageSize);
        const allCourses: Course[] = response.data;
        const categories = Array.from(
          new Set(allCourses.map((c: Course) => c.category))
        );
        let filteredCourses = allCourses;

        if (searchTerm) {
          filteredCourses = filteredCourses.filter(
            (c: Course) =>
              c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (categoryFilter !== "all") {
          filteredCourses = filteredCourses.filter(
            (c: Course) => c.category === categoryFilter
          );
        }

        if (levelFilter !== "all") {
          filteredCourses = filteredCourses.filter(
            (c: Course) => c.level === levelFilter
          );
        }

        const totalCourses = filteredCourses.length;
        const totalPages = Math.ceil(totalCourses / pageSize);
        const paginatedCourses = filteredCourses.slice(
          (page - 1) * pageSize,
          page * pageSize
        );

        return {
          courses: paginatedCourses,
          totalCourses,
          totalPages,
          categories,
        };
      },
      enabled: !!user && user.role === "admin",
    });
  console.log(coursesData);
  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async ({
      courseId,
      isPublished,
    }: {
      courseId: string;
      isPublished: boolean;
    }) => {
      return await coursesApi.update(courseId, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Course updated",
        description: "The course has been updated successfully.",
      });
      setEditingCourse(null);
    },
    onError: (error) => {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      return await coursesApi.delete(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      });
      setConfirmDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setIsPublished(course.isPublished || false);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;

    updateCourseMutation.mutate({
      courseId: editingCourse._id,
      isPublished,
    });
  };

  const handleDeleteCourse = () => {
    if (!confirmDelete) return;

    deleteCourseMutation.mutate(confirmDelete);
  };

  const isLoading = loading || coursesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center  max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Icons.logo className="h-8 w-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center  max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1  max-w-7xl mx-auto p-2">
        <div className="container py-12">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Manage Courses</h1>
                <p className="text-muted-foreground">
                  View and manage all courses on the platform
                </p>
              </div>
              <Button onClick={() => router.push("/admin/courses/new")}>
                Add New Course
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  Total courses: {coursesData?.totalCourses || 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                      <Input
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setPage(1); // Reset to first page on search
                        }}
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <Select
                        value={categoryFilter}
                        onValueChange={(value) => {
                          setCategoryFilter(value);
                          setPage(1); // Reset to first page on filter change
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {coursesData?.categories.map((category: string) => (
                            <SelectItem key={category} value={category || ""}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full md:w-48">
                      <Select
                        value={levelFilter}
                        onValueChange={(value) => {
                          setLevelFilter(value);
                          setPage(1); // Reset to first page on filter change
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Title</th>
                          <th className="text-left font-medium p-2">
                            Instructor
                          </th>
                          <th className="text-left font-medium p-2">
                            Category
                          </th>
                          <th className="text-left font-medium p-2">Level</th>
                          <th className="text-left font-medium p-2">Price</th>
                          <th className="text-left font-medium p-2">Status</th>
                          <th className="text-left font-medium p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesData?.courses.map((course: any) => (
                          <tr key={course._id} className="border-b">
                            <td className="p-2">{course.title}</td>
                            <td className="p-2">
                              {course.instructor?.name || "Unknown"}
                            </td>
                            <td className="p-2">{course.category}</td>
                            <td className="p-2 capitalize">{course.level}</td>
                            <td className="p-2">${course.price.toFixed(2)}</td>
                            <td className="p-2">
                              <Badge
                                variant={
                                  course.isPublished ? "default" : "outline"
                                }
                              >
                                {course.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/admin/courses/${course._id}`)
                                  }
                                >
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => setConfirmDelete(course._id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {(!coursesData?.courses ||
                          coursesData.courses.length === 0) && (
                          <tr>
                            <td
                              colSpan={7}
                              className="p-4 text-center text-muted-foreground"
                            >
                              No courses found. Try adjusting your search or
                              filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {coursesData && coursesData.totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={
                              page === 1
                                ? undefined
                                : () => setPage((p) => Math.max(1, p - 1))
                            }
                            className={
                              page === 1 ? "opacity-50 cursor-not-allowed" : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: coursesData.totalPages },
                          (_, i) => i + 1
                        )
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === coursesData.totalPages ||
                              (p >= page - 1 && p <= page + 1)
                          )
                          .map((p, i, arr) => {
                            // Add ellipsis
                            if (i > 0 && p > arr[i - 1] + 1) {
                              return (
                                <React.Fragment key={`ellipsis-${p}`}>
                                  <PaginationItem>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                  <PaginationItem>
                                    <PaginationLink
                                      isActive={page === p}
                                      onClick={() => setPage(p)}
                                    >
                                      {p}
                                    </PaginationLink>
                                  </PaginationItem>
                                </React.Fragment>
                              );
                            }

                            return (
                              <PaginationItem key={p}>
                                <PaginationLink
                                  isActive={page === p}
                                  onClick={() => setPage(p)}
                                >
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={
                              page === coursesData.totalPages
                                ? undefined
                                : () =>
                                    setPage((p) =>
                                      Math.min(coursesData.totalPages, p + 1)
                                    )
                            }
                            className={
                              page === coursesData.totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Edit Course Dialog */}
      <Dialog
        open={!!editingCourse}
        onOpenChange={(open) => !open && setEditingCourse(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          {editingCourse && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Title:</div>
                <div className="col-span-3">{editingCourse.title}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Instructor:</div>
                <div className="col-span-3">
                  {editingCourse.instructor?.name || "Unknown"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Category:</div>
                <div className="col-span-3">{editingCourse.category}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Level:</div>
                <div className="col-span-3 capitalize">
                  {editingCourse.level}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Price:</div>
                <div className="col-span-3">
                  ${editingCourse.price.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Status:</div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor="published">
                    {isPublished ? "Published" : "Draft"}
                  </Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCourse(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCourse}
              disabled={updateCourseMutation.isPending}
            >
              {updateCourseMutation.isPending ? (
                <>
                  <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? (
                <>
                  <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
