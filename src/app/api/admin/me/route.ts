import { NextRequest, NextResponse } from "next/server";
import { validateSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authenticated = validateSessionFromRequest(request);
  if (!authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
