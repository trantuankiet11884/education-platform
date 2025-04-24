"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { booksApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function NewBookPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("0");
  const [isFree, setIsFree] = useState(false);
  const [coverImage, setCoverImage] = useState(
    "/placeholder.svg?height=300&width=200"
  );
  const [fileUrl, setFileUrl] = useState("#");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }

    if (!loading && user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Create book mutation
  const createBookMutation = useMutation({
    mutationFn: async (bookData: any) => {
      return await booksApi.create(bookData);
    },
    onSuccess: (data) => {
      toast({
        title: "Book created",
        description: "The book has been created successfully.",
      });
      router.push(`/admin/books/${data._id}`);
    },
    onError: (error) => {
      console.error("Error creating book:", error);
      toast({
        title: "Error",
        description: "Failed to create book. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !description || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const bookData = {
      title,
      author,
      description,
      coverImage,
      fileUrl,
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      price: Number.parseFloat(price),
      isFree,
      createdBy: user?._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createBookMutation.mutate(bookData);
  };

  if (loading) {
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
      <main className="flex-1  max-w-7xl mx-auto">
        <div className="container py-12">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Add New Book</h1>
                <p className="text-muted-foreground">
                  Add a new book to the platform
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/books")}
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Book Information</CardTitle>
                  <CardDescription>
                    Provide the details about the book
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Web Development Handbook"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g., John Smith"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed description of the book"
                      rows={4}
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
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., HTML, CSS, JavaScript"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image URL</Label>
                      <Input
                        id="coverImage"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="URL to the book cover image"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fileUrl">Book File URL</Label>
                      <Input
                        id="fileUrl"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        placeholder="URL to the book file"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFree"
                      checked={isFree}
                      onCheckedChange={(checked) => {
                        setIsFree(checked);
                        if (checked) setPrice("0");
                      }}
                    />
                    <Label htmlFor="isFree">This book is free</Label>
                  </div>

                  {!isFree && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g., 19.99"
                        required
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/admin/books")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createBookMutation.isPending}>
                    {createBookMutation.isPending ? (
                      <>
                        <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Book"
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
