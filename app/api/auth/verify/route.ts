import { NextResponse } from "next/server";
import { User } from "@/lib/models/user";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Lấy token từ header Authorization
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // Nếu không có token, kiểm tra cookie (tùy theo cách bạn cấu hình trong auth-provider)
    const cookies = Object.fromEntries(
      request.headers
        .get("Cookie")
        ?.split("; ")
        .map((c) => c.split("=")) || []
    );
    const firebaseIdFromCookie = cookies["firebaseId"];

    if (!token && !firebaseIdFromCookie) {
      console.error("No token or firebaseId provided");
      return NextResponse.json(
        { error: "No authentication token or firebaseId provided" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    let firebaseId: string;

    // Nếu có token, cần cách để lấy firebaseId từ token
    // Vì không dùng Admin SDK, chúng ta dựa vào client gửi firebaseId trực tiếp qua cookie
    if (firebaseIdFromCookie) {
      firebaseId = firebaseIdFromCookie;
    } else {
      // Giả sử client gửi token và bạn có cách lấy firebaseId từ token
      // Ở đây chúng ta không thể verify token trực tiếp, nên cần firebaseId từ client
      console.error("Token provided but no way to verify without Admin SDK");
      return NextResponse.json(
        { error: "Cannot verify token without Firebase Admin SDK" },
        { status: 400 }
      );
    }

    // Tìm user trong database bằng firebaseId
    const user = await User.findOne({ firebaseId });

    if (!user) {
      console.log("User not found for firebaseId:", firebaseId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User verified successfully:", user);
    return NextResponse.json({
      firebaseId: user.firebaseId,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { error: "Failed to verify user", details: (error as Error).message },
      { status: 500 }
    );
  }
}
