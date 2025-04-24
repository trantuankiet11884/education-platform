"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/seed");
      const data = await response.json();

      setResult(data);

      toast({
        title: data.message || "Seed operation completed",
        description: data.error
          ? `Error: ${data.error}`
          : `Created ${data.instructors || 0} instructors, ${
              data.courses || 0
            } courses, and ${data.lessons || 0} lessons.`,
        variant: data.error ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Error",
        description: "Failed to seed database. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Seed Database</CardTitle>
              <CardDescription>
                This will create sample data in your database including
                instructors, courses, and lessons.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Warning: This operation is meant for development purposes. It
                will only add data if the database is empty.
              </p>

              {result && (
                <div className="bg-muted p-4 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Result:</h3>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSeed}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Icons.logo className="mr-2 h-4 w-4 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  "Seed Database"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
