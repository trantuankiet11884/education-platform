"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Sử dụng API thực tế
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: blogApi.getAll,
  });

  // Get unique categories
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Blog
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Insights, tutorials, and news from our education experts.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Icons.logo className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No blog posts found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8">
                  {filteredPosts.map((post) => (
                    <Card key={post._id} className="overflow-hidden">
                      <div className="grid md:grid-cols-[2fr_3fr]">
                        <div className="relative aspect-video md:aspect-auto overflow-hidden">
                          <img
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge>{post.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {post.publishedAt
                                  ? new Date(
                                      post.publishedAt
                                    ).toLocaleDateString()
                                  : "Not published"}
                              </span>
                            </div>
                            <CardTitle className="text-2xl">
                              {post.title}
                            </CardTitle>
                            <CardDescription>{post.excerpt}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={post.author?.avatar}
                                  alt={post.author?.name}
                                />
                                <AvatarFallback>
                                  {post.author?.name?.charAt(0) || "A"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">
                                {post.author?.name || "Unknown Author"}
                              </span>
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                              <Button>Read More</Button>
                            </Link>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
