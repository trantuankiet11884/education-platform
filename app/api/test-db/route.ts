import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db";

export async function GET() {
  try {
    const isConnected = await testConnection();
    return NextResponse.json({
      connected: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { connected: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
