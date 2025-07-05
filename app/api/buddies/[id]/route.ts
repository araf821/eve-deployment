import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/lib/auth";
import { db } from "@/server/db";
import { buddyConnectionsTable } from "@/server/db/schema";
import { eq, and, or } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the buddy connection to find the buddy ID
    const [connection] = await db
      .select()
      .from(buddyConnectionsTable)
      .where(
        and(
          eq(buddyConnectionsTable.id, id),
          eq(buddyConnectionsTable.userId, user.id)
        )
      );

    if (!connection) {
      return Response.json(
        { error: "Buddy connection not found" },
        { status: 404 }
      );
    }

    // Delete both directions of the buddy connection
    await db
      .delete(buddyConnectionsTable)
      .where(
        or(
          and(
            eq(buddyConnectionsTable.userId, user.id),
            eq(buddyConnectionsTable.buddyId, connection.buddyId)
          ),
          and(
            eq(buddyConnectionsTable.userId, connection.buddyId),
            eq(buddyConnectionsTable.buddyId, user.id)
          )
        )
      );

    return Response.json({
      message: "Buddy removed successfully",
    });
  } catch (error) {
    console.error("Delete buddy error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
