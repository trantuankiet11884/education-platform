// Trong file app/api/books/user/[id]/route.ts
import { NextResponse } from "next/server";
import { Book } from "@/lib/models/book";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    // Tìm tất cả sách có createdBy = userId
    const books = await Book.find({ createdBy: id }).sort({ createdAt: -1 });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books by user:", error);
    return NextResponse.json(
      { error: "Failed to fetch books by user" },
      { status: 500 }
    );
  }
}
