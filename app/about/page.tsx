import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center  max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1  max-w-7xl mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  About EduLearn
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our mission is to provide accessible, high-quality education
                  for everyone.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-8 py-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Story</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  EduLearn was founded in 2023 with a simple mission: to make
                  quality education accessible to everyone, regardless of their
                  location or background. What started as a small collection of
                  programming tutorials has grown into a comprehensive learning
                  platform with courses spanning multiple disciplines.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We envision a world where anyone, anywhere can transform their
                  life through education. We believe that education is a
                  fundamental right and that technology can help break down
                  barriers to access.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Our Team</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our team consists of passionate educators, developers, and
                  designers who are committed to creating the best learning
                  experience possible. We work closely with industry experts to
                  ensure our content is relevant, up-to-date, and aligned with
                  industry standards.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Join Our Community</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  When you join EduLearn, you're not just taking a course –
                  you're becoming part of a global community of learners.
                  Connect with fellow students, collaborate on projects, and get
                  support when you need it.
                </p>
                <div className="flex justify-center pt-4">
                  <Link href="/auth/register">
                    <Button size="lg">Get Started Today</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
