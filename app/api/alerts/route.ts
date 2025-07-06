import { db } from "@/server/db";
import { alertsTable, usersTable } from "@/server/db/schema";
import { getCurrentUser } from "@/server/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { lat, lng, address, description, hasImage } = await request.json();

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
      .returning();

    return Response.json(alert);
  } catch (error) {
    console.error("Error creating alert:", error);
    return new Response("Internal Server Error", { status: 500 });
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
      .orderBy(alertsTable.createdAt);

    return Response.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const alertId = searchParams.get("id");

  if (!alertId) {
    return new Response("Alert ID is required", { status: 400 });
  }

  try {
    // First, check if the alert exists and belongs to the current user
    const [existingAlert] = await db
      .select()
      .from(alertsTable)
      .where(eq(alertsTable.id, alertId))
      .limit(1);

    if (!existingAlert) {
      return new Response("Alert not found", { status: 404 });
    }

    if (existingAlert.userId !== user.id) {
      return new Response("Forbidden: You can only delete your own alerts", {
        status: 403,
      });
    }

    // Delete the alert
    await db.delete(alertsTable).where(eq(alertsTable.id, alertId));

    return new Response("Alert deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
