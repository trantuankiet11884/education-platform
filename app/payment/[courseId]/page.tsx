"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-provider";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

type PaymentProps = {
  params: Promise<{ courseId: string }>;
};

export default function PaymentPage({ params }: PaymentProps) {
  const { courseId } = React.use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesApi.getById(courseId),
  });

  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please log in to proceed with payment.",
      variant: "destructive",
    });
    router.push("/auth/login");
    return null;
  }

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.logo className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  console.log(course);

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Course Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The course you are trying to purchase does not exist.
            </p>
            <Button asChild className="mt-4">
              <a href="/courses">Browse Courses</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <PayPalScriptProvider options={paypalOptions}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={course.thumbnail || "/placeholder.svg?height=80&width=80"}
                alt={course.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-muted-foreground">
                  Instructor: {course.instructor?.name || "Unknown"}
                </p>
                <p className="text-lg font-bold">${course.price.toFixed(2)}</p>
              </div>
            </div>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={async () => {
                try {
                  const response = await fetch("/api/payment/create-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseId, studentId: user._id }),
                  });
                  const data = await response.json();
                  if (data.orderID) {
                    return data.orderID;
                  }
                  console.log(data);
                  throw new Error(
                    data.error || "Failed to create PayPal order"
                  );
                } catch (error: any) {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                  throw error;
                }
              }}
              onApprove={async (data) => {
                try {
                  const response = await fetch("/api/payment/capture-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      orderID: data.orderID,
                      courseId,
                      paypalEmail:
                        course.instructor?.paypalEmail ||
                        course.instructor?.email,
                      studentId: user?._id,
                    }),
                  });
                  const result = await response.json();
                  if (result.status === "success") {
                    router.push(
                      `/payment/success?transactionId=${result.transactionId}`
                    );
                  } else {
                    throw new Error(result.error || "Payment not completed");
                  }
                } catch (error: any) {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                  router.push("/payment/error");
                }
              }}
              onError={(err: any) => {
                toast({
                  title: "Error",
                  description: err.message || "Payment not completed",
                  variant: "destructive",
                });
                // router.push("/payment/error");
              }}
              onCancel={() => {
                router.push(`/courese/${courseId}`);
              }}
            />
          </CardContent>
        </Card>
      </PayPalScriptProvider>
    </div>
  );
}
