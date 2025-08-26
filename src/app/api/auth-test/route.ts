import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: any) {
  const authResult = getAuth(req);
  const userId = authResult.userId;

  return NextResponse.json({
    authenticated: !!userId,
    userId: userId || null,
    sessionId: authResult.sessionId || null,
  });
}
