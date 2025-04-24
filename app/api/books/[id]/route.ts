import { NextResponse } from "next/server"
import { Book } from "@/lib/models/book"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await connectToDatabase()

    const book = await Book.findById(id).populate("createdBy", "name")

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    await connectToDatabase()

    const book = await Book.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await connectToDatabase()

    const book = await Book.findByIdAndDelete(id)

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}

