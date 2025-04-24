import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/lib/models/blog-post";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await connectToDatabase();

    // Find the blog post by slug instead of ID
    const post = await BlogPost.findOne({ slug }).populate(
      "author",
      "name avatar bio"
    );

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
