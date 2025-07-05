import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/lib/auth";
import { db } from "@/server/db";
import { buddyRequestsTable } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

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

    // Delete the buddy request (only if user is the sender and status is pending)
    const result = await db
      .delete(buddyRequestsTable)
      .where(
        and(
          eq(buddyRequestsTable.id, id),
          eq(buddyRequestsTable.senderId, user.id),
          eq(buddyRequestsTable.status, "pending")
        )
      )
      .returning();

    if (result.length === 0) {
      return Response.json(
        { error: "Buddy request not found or cannot be canceled" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Buddy request canceled successfully",
    });
  } catch (error) {
    console.error("Cancel buddy request error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
