import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
              404 - Page Not Found
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/">
              <Button size="lg">Go to Homepage</Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
