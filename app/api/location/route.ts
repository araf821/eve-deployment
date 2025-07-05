import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { getCurrentUser } from "@/server/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  
  const { lat, lng } = await request.json();
  await db.update(usersTable).set({ lat, lng, locationUpdated: new Date() }).where(eq(usersTable.id, user.id));
  return new Response("OK");
}