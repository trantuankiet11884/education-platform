"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import React from "react";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);

  // In a real app, we would fetch the blog post from the API
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetch(`/api/blog/slug/${slug}`).then((res) => res.json()),
  });

  // In a real app, we would fetch related posts from the API
  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["related-posts", slug],
    queryFn: () => fetch(`/api/blog/related/${slug}`).then((res) => res.json()),
    enabled: !!post,
  });

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

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center  max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Blog post not found</h1>
            <p className="text-muted-foreground">
              The blog post you are looking for does not exist.
            </p>
            <Link href="/blog">
              <Button className="mt-4">Back to Blog</Button>
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
        <article className="container py-12">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
            >
              ← Back to Blog
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge>{post.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center gap-4 mb-8">
                <Avatar>
                  <AvatarImage
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {post.author.bio}
                  </div>
                </div>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8">
                <img
                  src={post.coverImage || "/placeholder.svg"}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="flex flex-wrap gap-2 mt-8">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t pt-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>

              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((relatedPost: any) => (
                  <Card key={relatedPost._id} className="overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={relatedPost.coverImage || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="object-cover w-full h-full transition-all hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {relatedPost.title}
                      </CardTitle>
                      <CardDescription>{relatedPost.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        By {relatedPost.author.name} •{" "}
                        {new Date(relatedPost.publishedAt).toLocaleDateString()}
                      </div>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
