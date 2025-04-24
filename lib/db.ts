import mongoose from "mongoose";
import { registerModels } from "./models";

// Define a type for the cached object
interface CachedConnection {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

declare global {
  var mongoose: CachedConnection;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached: CachedConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Creating new MongoDB connection");
    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");
        registerModels(); // Đăng ký tất cả model sau khi kết nối
        return mongooseInstance;
      });
  } else {
    console.log("Using existing MongoDB connection promise");
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    await connectToDatabase();
    console.log("MongoDB connection successful!");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return false;
  }
}
