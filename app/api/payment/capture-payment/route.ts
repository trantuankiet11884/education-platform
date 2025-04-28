import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "../create-payment/route";
import axios from "axios";
import { Payment } from "@/lib/models/payment";
import { Course } from "@/lib/models/course";

export async function POST(request: Request) {
  try {
    const { orderID, courseId, studentId, paypalEmail } = await request.json();

    if (!orderID || !courseId || !studentId || !paypalEmail) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${!orderID ? "orderID" : ""} ${
            !courseId ? "courseId" : ""
          } ${!studentId ? "studentId" : ""} ${
            !paypalEmail ? "paypalEmail" : ""
          }`,
        },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = response.data;

    if (captureData.status === "COMPLETED") {
      const capture = captureData.purchase_units[0].payments.captures[0];
      const amount = parseFloat(capture.amount.value);
      const paypalPaymentId = capture.id;

      const course = await Course.findById(courseId).populate("instructor");
      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const payment = new Payment({
        courseId,
        studentId,
        instructorId: course.instructor._id,
        amount,
        paypalPaymentId,
        status: "completed",
        paypalEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await payment.save();

      return NextResponse.json({
        status: "success",
        transactionId: paypalPaymentId,
        amount,
      });
    } else {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("PayPal Capture Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
