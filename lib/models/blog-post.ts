import mongoose, { Schema, type Document } from "mongoose"

export interface IBlogPost extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  author: mongoose.Types.ObjectId
  category: string
  tags: string[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema)

