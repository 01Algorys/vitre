import { NextRequest, NextResponse } from "next/server";
import { readSection, writeSection, SECTION_FILE_MAP } from "@/lib/content";
import { validateSessionFromRequest } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ section: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { section } = await context.params;

  if (!SECTION_FILE_MAP[section]) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  try {
    const data = readSection(section);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authenticated = validateSessionFromRequest(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { section } = await context.params;

  if (!SECTION_FILE_MAP[section]) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  try {
    const data = await request.json();
    writeSection(section, data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to write content" }, { status: 500 });
  }
}
