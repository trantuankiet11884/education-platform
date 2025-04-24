// app/api/logs/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Schema, model, models } from "mongoose";

const LogSchema = new Schema({
  event: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ipAddress: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = models.Log || model("Log", LogSchema);

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const logs = await Log.find()
      .populate("userId", "name email") // Populate user details
      .sort({ timestamp: -1 }) // Sort by most recent
      .limit(5); // Limit to 5 recent logs

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
