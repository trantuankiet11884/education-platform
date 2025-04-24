import { FeaturedCourses } from "@/components/featured-courses";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { MainNav } from "@/components/main-nav";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col p-2">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto">
        <HeroSection />
        <FeaturedCourses />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
