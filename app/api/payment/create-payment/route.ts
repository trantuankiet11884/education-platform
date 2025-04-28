import { NextResponse } from "next/server";
import { Course } from "@/lib/models/course";
import { User } from "@/lib/models/user";
import axios from "axios";

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_SECRET!;
  const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

  try {
    const response = await axios.post(url, "grant_type=client_credentials", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
    });
    return response.data.access_token;
  } catch (error: any) {
    throw new Error("Failed to get PayPal access token: " + error.message);
  }
}

export async function POST(request: Request) {
  try {
    const { courseId, studentId } = await request.json();

    if (!courseId || !studentId) {
      return NextResponse.json(
        { error: "Missing courseId or studentId" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId).populate("instructor");
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const instructor = await User.findById(course.instructor);
    if (!instructor || !instructor.paypalEmail) {
      return NextResponse.json(
        { error: "Instructor PayPal email not found" },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: course.price.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: course.price.toFixed(2),
                },
              },
            },
            payee: {
              email_address: instructor.paypalEmail,
            },
            description: course.title,
            reference_id: courseId,
            items: [
              {
                name: course.title,
                unit_amount: {
                  currency_code: "USD",
                  value: course.price.toFixed(2),
                },
                quantity: "1",
              },
            ],
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/capture-payment`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
          brand_name: "EduLearn Platform Name",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      orderID: response.data.id,
      paypalEmail: instructor.paypalEmail,
      studentId: studentId,
    });
  } catch (error: any) {
    console.error("PayPal Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
