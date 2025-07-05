import "server-only";
import { auth } from "@/lib/auth";

/**
 * Server-side helper to get the current user session
 * Use this in server components, API routes, and server actions
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Server-side helper to get the full session
 * Use this in server components, API routes, and server actions
 */
export async function getCurrentSession() {
  return await auth();
}
