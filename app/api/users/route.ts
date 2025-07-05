import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { isNotNull } from "drizzle-orm";

export async function GET() {
  const users = await db.select({ id: usersTable.id, name: usersTable.name, lat: usersTable.lat, lng: usersTable.lng }).from(usersTable).where(isNotNull(usersTable.lat));
  return Response.json(users);
}