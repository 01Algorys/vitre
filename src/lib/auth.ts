import { NextRequest } from "next/server";

// --- Credentials (swap these constants for env vars / external auth later) ---
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "cherifouali@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "CherifOuali123Admin";
export const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? "co-admin-sess-v1-2025";
export const COOKIE_NAME   = "admin_session";

// --- Auth interface (replace implementation for Supabase/Clerk/Firebase later) ---

export async function validateCredentials(
  email: string,
  password: string
): Promise<boolean> {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function validateSessionFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return token === SESSION_TOKEN;
}

// Used in server components / server actions via next/headers
export async function validateSessionFromCookieStore(
  cookieStore: { get(name: string): { value: string } | undefined }
): Promise<boolean> {
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token === SESSION_TOKEN;
}
