import { NextResponse } from "next/server"
import { BlogPost } from "@/lib/models/blog-post"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    await connectToDatabase()
    const posts = await BlogPost.find({ isPublished: true }).populate("author", "name avatar").sort({ publishedAt: -1 })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()

    const post = new BlogPost({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: body.isPublished ? new Date() : null,
    })

    await post.save()

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}

