import { Footer } from "@/components/footer";
import { MainNav } from "@/components/main-nav";

export default function TermsPage() {
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
            <div className="mx-auto max-w-3xl space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Terms of Service
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Last updated: April 7, 2025
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Welcome to EduLearn. These Terms of Service govern your use of
                  our website, services, and applications. By accessing or using
                  EduLearn, you agree to be bound by these Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. Definitions</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  "Service" refers to the EduLearn website, applications, and
                  services provided by EduLearn. "User" refers to any individual
                  who accesses or uses the Service. "Content" refers to all
                  materials available on the Service, including courses,
                  lessons, quizzes, and other educational materials.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. Account Registration</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  To access certain features of the Service, you may be required
                  to register for an account. You agree to provide accurate,
                  current, and complete information during the registration
                  process and to update such information to keep it accurate,
                  current, and complete.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. User Conduct</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  You agree not to use the Service for any illegal purpose or in
                  violation of any local, state, national, or international law.
                  You agree not to attempt to circumvent any security features
                  of the Service or to interfere with the proper working of the
                  Service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. Intellectual Property</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  The Service and its original content, features, and
                  functionality are owned by EduLearn and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property or proprietary rights laws.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Termination</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We may terminate or suspend your account and bar access to the
                  Service immediately, without prior notice or liability, under
                  our sole discretion, for any reason whatsoever and without
                  limitation, including but not limited to a breach of the
                  Terms.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">7. Changes to Terms</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material, we will provide at least 30
                  days' notice prior to any new terms taking effect. What
                  constitutes a material change will be determined at our sole
                  discretion.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Contact Us</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  If you have any questions about these Terms, please contact us
                  at support@edulearn.com.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
