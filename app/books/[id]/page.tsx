"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // In a real app, we would fetch the book from the API
  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => fetch(`/api/books/${id}`).then((res) => res.json()),
  });

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or sign up to purchase this book.",
      });
      router.push("/auth/login");
      return;
    }

    // In a real app, we would handle the purchase via API
    toast({
      title: "Purchase successful",
      description: `You have successfully purchased "${book.title}".`,
    });
  };

  const handleDownload = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or sign up to download this book.",
      });
      router.push("/auth/login");
      return;
    }

    // In a real app, we would handle the download via API
    toast({
      title: "Download started",
      description: `Your download of "${book.title}" has started.`,
    });
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

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Book not found</h1>
            <p className="text-muted-foreground">
              The book you are looking for does not exist.
            </p>
            <Link href="/books">
              <Button className="mt-4">Browse Books</Button>
            </Link>
          </div>
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
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div>
              <div className="sticky top-24">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <img
                    src={book.coverImage || "/placeholder.svg"}
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                  {book.isFree && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      Free
                    </Badge>
                  )}
                </div>
                <div className="mt-4 space-y-4">
                  {book.isFree ? (
                    <Button className="w-full" onClick={handleDownload}>
                      Download Free
                    </Button>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        ${book.price.toFixed(2)}
                      </div>
                      <Button className="w-full" onClick={handlePurchase}>
                        Purchase
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <p className="text-xl text-muted-foreground">
                  by {book.author}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge>{book.category}</Badge>
                  {book.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{book.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {book.createdBy.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{book.createdBy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {book.createdBy.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p>{book.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p>{new Date(book.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Updated
                      </p>
                      <p>{new Date(book.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p>
                        {book.isFree ? "Free" : `$${book.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
