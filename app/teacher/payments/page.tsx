"use client";

import { Footer } from "@/components/footer";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { AlertTriangle, Box, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { debounce } from "lodash";

interface Transaction {
  transactionId: string;
  course: { id: string; title: string; price: number };
  student: { id: string; name: string; email: string };
  instructor: { id: string; name: string; paypalEmail: string };
  amount: number;
  status: string;
  createdAt: string;
  paypalDetails: {
    transactionStatus: string;
    amount: { value: string; currency_code: string };
    payerEmail: string;
  } | null;
}

const fetchTransactions = async (
  studentId: string,
  courseId: string,
  startDate: string,
  endDate: string
) => {
  const response = await axios.get("/api/payment/transactions", {
    params: {
      studentId: studentId || undefined,
      courseId: courseId || undefined,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return response.data.transactions as Transaction[];
};

export default function PaymentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // Validate date range
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setEndDate(startDate);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    if (!loading && user && user.role !== "teacher") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const debouncedSetStudentId = useMemo(
    () =>
      debounce((value: string) => {
        setStudentId(value);
      }, 500),
    []
  );

  const debouncedSetCourseId = useMemo(
    () =>
      debounce((value: string) => {
        setCourseId(value);
      }, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetStudentId.cancel();
      debouncedSetCourseId.cancel();
    };
  }, [debouncedSetStudentId, debouncedSetCourseId]);

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions", studentId, courseId, startDate, endDate],
    queryFn: () =>
      fetchTransactions(
        studentId,
        courseId,
        startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") : "",
        endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss'Z'") : ""
      ),
    enabled: !!user && user.role === "teacher",
  });

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center max-w-7xl mx-auto">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Icons.logo className="h-8 w-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (!user || user.role !== "teacher") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-7xl mx-auto">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 p-2">
        <div className="container py-12 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Payment History</h1>

          {/* Filters */}
          <div className="grid gap-4 mb-6 md:grid-cols-4">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => debouncedSetStudentId(e.target.value)}
                placeholder="Enter student ID"
              />
            </div>
            <div>
              <Label htmlFor="courseId">Course ID</Label>
              <Input
                id="courseId"
                value={courseId}
                onChange={(e) => debouncedSetCourseId(e.target.value)}
                placeholder="Enter course ID"
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message ||
                  "Failed to fetch transactions. Please try again later."}
              </AlertDescription>
            </Alert>
          )}

          {/* Transactions Table */}
          {isLoading ? (
            <div className="flex justify-center">
              <Icons.logo className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.transactionId}>
                      <TableCell>{tx.transactionId}</TableCell>
                      <TableCell>
                        {tx.course.title} (${tx.course.price})
                      </TableCell>
                      <TableCell>
                        {tx.student.name} ({tx.student.email})
                      </TableCell>
                      <TableCell>{tx.instructor.name}</TableCell>
                      <TableCell>${tx.amount}</TableCell>
                      <TableCell>
                        {tx.paypalDetails?.transactionStatus || tx.status}
                      </TableCell>
                      <TableCell>
                        {format(new Date(tx.createdAt), "PPP")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Box className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground">
                          No Transactions Found
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Try adjusting the filters or date range.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
