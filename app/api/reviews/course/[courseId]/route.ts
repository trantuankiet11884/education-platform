import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/lib/models/review";

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectToDatabase();
    const { courseId } = params;
    const reviews = await Review.find({ courseId }).populate(
      "userId",
      "name avatar"
    );
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
