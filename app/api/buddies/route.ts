import { getCurrentUser } from "@/server/lib/auth"
import { db } from "@/server/db"
import { buddyConnectionsTable, usersTable } from "@/server/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all buddy connections for the user
    const buddyConnections = await db
      .select({
        id: buddyConnectionsTable.id,
        nickname: buddyConnectionsTable.nickname,
        phoneNumber: buddyConnectionsTable.phoneNumber,
        createdAt: buddyConnectionsTable.createdAt,
        lat: usersTable.lat,
        lng: usersTable.lng,
        name: usersTable.name,
        email: usersTable.email,
        image: usersTable.image,
        lastSeen: usersTable.locationUpdated,
      })
      .from(buddyConnectionsTable)
      .innerJoin(usersTable, eq(buddyConnectionsTable.buddyId, usersTable.id))
      .where(eq(buddyConnectionsTable.userId, user.id))
      .orderBy(buddyConnectionsTable.createdAt)

    // Return the array directly (not wrapped in an object)
    return Response.json(buddyConnections)
  } catch (error) {
    console.error("Get buddies error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
