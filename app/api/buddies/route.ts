import { getCurrentUser } from "@/server/lib/auth";
import { db } from "@/server/db";
import { buddyConnectionsTable, usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all buddy connections for the user
    const buddies = await db
      .select({
        id: buddyConnectionsTable.id,
        nickname: buddyConnectionsTable.nickname,
        phoneNumber: buddyConnectionsTable.phoneNumber,
        createdAt: buddyConnectionsTable.createdAt,
        buddy: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          image: usersTable.image,
        },
      })
      .from(buddyConnectionsTable)
      .innerJoin(usersTable, eq(buddyConnectionsTable.buddyId, usersTable.id))
      .where(eq(buddyConnectionsTable.userId, user.id))
      .orderBy(buddyConnectionsTable.createdAt);

    return Response.json({ buddies });
  } catch (error) {
    console.error("Get buddies error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
