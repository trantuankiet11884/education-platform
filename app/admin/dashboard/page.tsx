"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { coursesApi, logsApi, usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { Course, Log, User } from "@/lib/data";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }

    if (!loading && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Fetch users count
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: async () => {
      const users = await usersApi.getAll();
      return {
        total: users.length,
        students: users.filter((u) => u.role === "student").length,
        teachers: users.filter((u) => u.role === "teacher").length,
        admins: users.filter((u) => u.role === "admin").length,
        recent: users
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5),
      };
    },
    enabled: !!user && user.role === "admin",
  });

  // Fetch courses count
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses-count"],
    queryFn: async () => {
      const coursesResponse = await coursesApi.getAll(1, 10);
      const courses: Course[] = coursesResponse.data || coursesResponse; // Adjust based on API response
      return {
        total: courses.length,
        published: courses.filter((c) => c.isPublished).length || 0,
        enrollments: courses.reduce(
          (sum, course) => sum + (course.enrollmentCount || 0),
          0
        ),
        recent: courses
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5),
      };
    },
    enabled: !!user && user.role === "admin",
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ["admin-logs"],
    queryFn: async () => {
      const logs: Log[] = await logsApi.getAll();
      return logs;
    },
    enabled: !!user && user.role === "admin",
  });

  const isLoading = loading || usersLoading || coursesLoading || logsLoading;

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
      <main className="flex-1  max-w-7xl mx-auto  p-2">
        <div className="container py-12">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your platform and users
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/users">
                  <Button variant="outline">Manage Users</Button>
                </Link>
                <Link href="/admin/courses">
                  <Button variant="outline">Manage Courses</Button>
                </Link>
                <Link href="/admin/seed">
                  <Button>Seed Database</Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>
                    All registered users on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {usersData?.total || 0}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-medium">
                        {usersData?.students || 0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Teachers</span>
                      <span className="font-medium">
                        {usersData?.teachers || 0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Admins</span>
                      <span className="font-medium">
                        {usersData?.admins || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Courses</CardTitle>
                  <CardDescription>All courses on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {coursesData?.total || 0}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Published</span>
                      <span className="font-medium">
                        {coursesData?.published || 0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Enrollments</span>
                      <span className="font-medium">
                        {coursesData?.enrollments || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Total platform revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$0.00</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Last Month</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="recent-users">
              <TabsList>
                <TabsTrigger value="recent-users">Recent Users</TabsTrigger>
                <TabsTrigger value="recent-courses">Recent Courses</TabsTrigger>
                <TabsTrigger value="system-logs">System Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="recent-users" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recently Registered Users</CardTitle>
                    <CardDescription>
                      The newest users on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left font-medium p-2">
                                Name
                              </th>
                              <th className="text-left font-medium p-2">
                                Email
                              </th>
                              <th className="text-left font-medium p-2">
                                Role
                              </th>
                              <th className="text-left font-medium p-2">
                                Joined
                              </th>
                              <th className="text-left font-medium p-2">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersData?.recent?.length || 0 > 0 ? (
                              usersData?.recent?.map((user: User) => (
                                <tr key={user._id} className="border-b">
                                  <td className="p-2">
                                    {user.name || "Unnamed"}
                                  </td>
                                  <td className="p-2">{user.email}</td>
                                  <td className="p-2">{user.role}</td>
                                  <td className="p-2">
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="p-2">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/admin/users/${user._id}`}>
                                        View
                                      </Link>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="p-2 text-center text-muted-foreground"
                                >
                                  No recent users found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end">
                        <Link href="/admin/users">
                          <Button variant="outline">View All Users</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="recent-courses" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recently Created Courses</CardTitle>
                    <CardDescription>
                      The newest courses on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left font-medium p-2">
                                Title
                              </th>
                              <th className="text-left font-medium p-2">
                                Instructor
                              </th>
                              <th className="text-left font-medium p-2">
                                Category
                              </th>
                              <th className="text-left font-medium p-2">
                                Created
                              </th>
                              <th className="text-left font-medium p-2">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {coursesData?.recent?.length || 0 > 0 ? (
                              coursesData?.recent?.map((course: Course) => (
                                <tr key={course._id} className="border-b">
                                  <td className="p-2">{course.title}</td>
                                  <td className="p-2">
                                    {course.instructor?.name || "Unknown"}
                                  </td>
                                  <td className="p-2">{course.category}</td>
                                  <td className="p-2">
                                    {new Date(
                                      course.createdAt
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="p-2">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link
                                        href={`/admin/courses/${course._id}`}
                                      >
                                        View
                                      </Link>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="p-2 text-center text-muted-foreground"
                                >
                                  No recent courses found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end">
                        <Link href="/admin/courses">
                          <Button variant="outline">View All Courses</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="system-logs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Logs</CardTitle>
                    <CardDescription>Recent system activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left font-medium p-2">
                                Event
                              </th>
                              <th className="text-left font-medium p-2">
                                User
                              </th>
                              <th className="text-left font-medium p-2">
                                IP Address
                              </th>
                              <th className="text-left font-medium p-2">
                                Timestamp
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {logsData?.length || 0 > 0 ? (
                              logsData?.map((log: Log) => (
                                <tr key={log._id} className="border-b">
                                  <td className="p-2">{log.event}</td>
                                  <td className="p-2">
                                    {(log.userId as User)?.name || "Unknown"}
                                  </td>
                                  <td className="p-2">{log.ipAddress}</td>
                                  <td className="p-2">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="p-2 text-center text-muted-foreground"
                                >
                                  No system logs available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-end">
                        <Link href="/admin/logs">
                          <Button variant="outline">View All Logs</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
