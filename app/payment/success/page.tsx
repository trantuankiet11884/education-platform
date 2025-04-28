import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import React from "react";

type Props = {
  searchParams: Promise<{ transactionId?: string }>;
};

export default function SuccessPage({ searchParams }: Props) {
  const { transactionId } = React.use(searchParams);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase! Your course has been added to your
            account.
          </p>
          {transactionId && (
            <p>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          )}
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/courses">Browse More Courses</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
