import { Footer } from "@/components/footer";
import { MainNav } from "@/components/main-nav";

export default function PrivacyPage() {
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
                  Privacy Policy
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Last updated: April 7, 2025
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  At EduLearn, we respect your privacy and are committed to
                  protecting your personal data. This Privacy Policy explains
                  how we collect, use, and safeguard your information when you
                  use our website and services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  2. Information We Collect
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We collect information you provide directly to us, such as
                  when you create an account, enroll in a course, or contact us.
                  This may include your name, email address, and payment
                  information. We also automatically collect certain information
                  when you use our Service, including your IP address, browser
                  type, and device information.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We use the information we collect to provide, maintain, and
                  improve our Service, to process your transactions, to send you
                  technical notices and support messages, and to respond to your
                  comments and questions. We may also use your information to
                  send you marketing communications about our products and
                  services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  4. Sharing Your Information
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We do not share your personal information with third parties
                  except as described in this Privacy Policy. We may share your
                  information with service providers who perform services on our
                  behalf, such as payment processing and data analysis. We may
                  also share your information if required by law or if we
                  believe that such action is necessary to comply with the law
                  or protect our rights.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. Data Security</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We take reasonable measures to help protect your personal
                  information from loss, theft, misuse, and unauthorized access,
                  disclosure, alteration, and destruction. However, no security
                  system is impenetrable, and we cannot guarantee the security
                  of our systems 100%.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Your Rights</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  You have the right to access, correct, or delete your personal
                  information. You can update your account information at any
                  time by logging into your account. If you wish to delete your
                  account, please contact us at privacy@edulearn.com.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  7. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the "Last updated" date at the top of
                  this page.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Contact Us</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  If you have any questions about this Privacy Policy, please
                  contact us at privacy@edulearn.com.
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
