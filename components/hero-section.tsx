"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";

export function HeroSection() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {user ? `Welcome Back, ${user.name}!` : "Learn Without Limits"}
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                {user
                  ? "Continue your learning journey with our interactive courses."
                  : "Discover a new way of learning with our interactive courses. Join thousands of students and start your journey today."}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {user ? (
                <>
                  <Link href="/courses">
                    <Button size="lg">Continue Learning</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline">
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/courses">
                    <Button size="lg">Browse Courses</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="lg" variant="outline">
                      Sign Up Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-muted/50">
              <img
                src="/placeholder.svg?height=350&width=600"
                alt="Hero Image"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
