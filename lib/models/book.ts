import mongoose, { Schema, type Document } from "mongoose"

export interface IBook extends Document {
  title: string
  author: string
  description: string
  coverImage: string
  fileUrl: string
  category: string
  tags: string[]
  price: number
  isFree: boolean
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  coverImage: { type: String, required: true },
  fileUrl: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  price: { type: Number, required: true },
  isFree: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Book = mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema)

