import { db } from "@/server/db"
import { alertsTable, usersTable } from "@/server/db/schema"
import { getCurrentUser } from "@/server/lib/auth"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const { lat, lng, address, description, hasImage } = await request.json()

  try {
    const [alert] = await db
      .insert(alertsTable)
      .values({
        userId: user.id,
        lat,
        lng,
        address,
        description: description || null,
        hasImage: hasImage ? "true" : "false",
      })
      .returning()

    return Response.json(alert)
  } catch (error) {
    console.error("Error creating alert:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export async function GET() {
  try {
    const alerts = await db
      .select({
        id: alertsTable.id,
        userId: alertsTable.userId,
        lat: alertsTable.lat,
        lng: alertsTable.lng,
        address: alertsTable.address,
        description: alertsTable.description,
        hasImage: alertsTable.hasImage,
        createdAt: alertsTable.createdAt,
        userName: usersTable.name,
      })
      .from(alertsTable)
      .leftJoin(usersTable, eq(alertsTable.userId, usersTable.id))
      .orderBy(alertsTable.createdAt)

    return Response.json(alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
