import { NextResponse } from "next/server";
import { Payment } from "@/lib/models/payment";
import { Course } from "@/lib/models/course";
import { User } from "@/lib/models/user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");
    const startDateStr =
      searchParams.get("start_date") || "2025-04-01T00:00:00Z";
    const endDateStr = searchParams.get("end_date") || "2025-04-30T23:59:59Z";

    const startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);

    if (startDate.getTime() === endDate.getTime()) {
      endDate.setHours(23, 59, 59, 999);
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    let query: any = {};
    if (studentId) query.studentId = studentId;
    if (courseId) query.courseId = courseId;
    query.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };

    const localPayments = await Payment.find(query)
      .populate({
        path: "courseId",
        model: Course,
        select: "title price",
      })
      .populate({
        path: "studentId",
        model: User,
        select: "name email",
      })
      .populate({
        path: "instructorId",
        model: User,
        select: "name email paypalEmail",
      });

    const validPayments = localPayments.filter(
      (payment: any) =>
        payment.courseId && payment.studentId && payment.instructorId
    );

    const transactions = validPayments.map((payment: any) => ({
      transactionId: payment.paypalPaymentId,
      course: {
        id: payment.courseId._id,
        title: payment.courseId.title,
        price: payment.courseId.price,
      },
      student: {
        id: payment.studentId._id,
        name: payment.studentId.name,
        email: payment.studentId.email,
      },
      instructor: {
        id: payment.instructorId._id,
        name: payment.instructorId.name,
        paypalEmail: payment.instructorId.paypalEmail,
      },
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      paypalDetails: null,
    }));

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error: any) {
    console.error("Payment Transactions Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
