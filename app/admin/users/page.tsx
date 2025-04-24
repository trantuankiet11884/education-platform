"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { usersApi } from "@/lib/api";
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

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editRole, setEditRole] = useState<"student" | "teacher" | "admin">(
    "student"
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }

    if (!loading && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Fetch users with pagination
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users", page, pageSize, searchTerm, roleFilter],
    queryFn: async () => {
      const allUsers = await usersApi.getAll();

      // Filter users
      let filteredUsers = allUsers;

      if (searchTerm) {
        filteredUsers = filteredUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (roleFilter !== "all") {
        filteredUsers = filteredUsers.filter((u) => u.role === roleFilter);
      }

      // Calculate pagination
      const totalUsers = filteredUsers.length;
      const totalPages = Math.ceil(totalUsers / pageSize);
      const paginatedUsers = filteredUsers.slice(
        (page - 1) * pageSize,
        page * pageSize
      );

      return {
        users: paginatedUsers,
        totalUsers,
        totalPages,
      };
    },
    enabled: !!user && user.role === "admin",
  });

  // Update user role mutation
  // Update user role mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "student" | "teacher" | "admin";
    }) => {
      return await usersApi.update(userId, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "User updated",
        description: "The user's role has been updated successfully.",
      });
      setEditingUser(null);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditRole(user.role);
  };

  const handleUpdateUser = () => {
    if (!editingUser || !editRole) return;

    updateUserMutation.mutate({
      userId: editingUser._id,
      role: editRole,
    });
  };

  const isLoading = loading || usersLoading;

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
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <p className="text-muted-foreground">
                  View and manage all users on the platform
                </p>
              </div>
              <Button onClick={() => router.push("/admin/users/new")}>
                Add New User
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Total users: {usersData?.totalUsers || 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setPage(1); // Reset to first page on search
                        }}
                      />
                    </div>
                    <div className="w-full md:w-48">
                      <Select
                        value={roleFilter}
                        onValueChange={(value) => {
                          setRoleFilter(value);
                          setPage(1); // Reset to first page on filter change
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="student">Students</SelectItem>
                          <SelectItem value="teacher">Teachers</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left font-medium p-2">Name</th>
                          <th className="text-left font-medium p-2">Email</th>
                          <th className="text-left font-medium p-2">Role</th>
                          <th className="text-left font-medium p-2">Joined</th>
                          <th className="text-left font-medium p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersData?.users.map((user: any) => (
                          <tr key={user._id} className="border-b">
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2 capitalize">{user.role}</td>
                            <td className="p-2">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/admin/users/${user._id}`)
                                  }
                                >
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {(!usersData?.users ||
                          usersData.users.length === 0) && (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-4 text-center text-muted-foreground"
                            >
                              No users found. Try adjusting your search or
                              filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {usersData && usersData.totalPages > 1 && (
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
                          { length: usersData.totalPages },
                          (_, i) => i + 1
                        )
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === usersData.totalPages ||
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
                              page === usersData.totalPages
                                ? undefined
                                : () =>
                                    setPage((p) =>
                                      Math.min(usersData.totalPages, p + 1)
                                    )
                            }
                            className={
                              page === usersData.totalPages
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

      {/* Edit User Dialog */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Name:</div>
                <div className="col-span-3">{editingUser.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Email:</div>
                <div className="col-span-3">{editingUser.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Role:</div>
                <div className="col-span-3">
                  <Select
                    value={editRole}
                    onValueChange={(value) =>
                      setEditRole(value as "student" | "teacher" | "admin")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
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
    </div>
  );
}
