import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/lib/auth";
import { db } from "@/server/db";
import { buddyRequestsTable, buddyConnectionsTable } from "@/server/db/schema";
import { buddyRequestActionSchema } from "@/lib/validations/buddy";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = buddyRequestActionSchema.safeParse(body);

    if (!validatedData.success) {
      return Response.json(
        { error: "Invalid data", details: validatedData.error },
        { status: 400 }
      );
    }

    const { action } = validatedData.data;

    // Get the buddy request
    const [buddyRequest] = await db
      .select()
      .from(buddyRequestsTable)
      .where(
        and(
          eq(buddyRequestsTable.id, id),
          eq(buddyRequestsTable.receiverId, user.id),
          eq(buddyRequestsTable.status, "pending")
        )
      );

    if (!buddyRequest) {
      return Response.json(
        { error: "Buddy request not found or already processed" },
        { status: 404 }
      );
    }

    if (action === "accept") {
      try {
        // Create buddy connections (bidirectional)
        // Note: Since neon-http doesn't support transactions, we handle this sequentially

        // Create connection from user to buddy
        await db.insert(buddyConnectionsTable).values({
          userId: user.id,
          buddyId: buddyRequest.senderId,
          nickname: buddyRequest.nickname,
          phoneNumber: buddyRequest.phoneNumber,
        });

        // Create reverse connection from buddy to user
        // Use the current user's name, or fallback to email or "Buddy"
        const reverseNickname =
          user.name || (user.email ? user.email.split("@")[0] : "Buddy");

        await db.insert(buddyConnectionsTable).values({
          userId: buddyRequest.senderId,
          buddyId: user.id,
          nickname: reverseNickname,
          phoneNumber: buddyRequest.phoneNumber,
        });

        // Delete the request after successful connections
        await db
          .delete(buddyRequestsTable)
          .where(eq(buddyRequestsTable.id, id));

        return Response.json({
          message: "Buddy request accepted successfully",
        });
      } catch (dbError) {
        console.error(
          "Database error during buddy request acceptance:",
          dbError
        );
        // If we get here, some operations may have succeeded and others failed
        // In a production app, you'd want more sophisticated cleanup logic
        return Response.json(
          { error: "Failed to create buddy connection" },
          { status: 500 }
        );
      }
    } else {
      // Reject the request - just delete it
      await db.delete(buddyRequestsTable).where(eq(buddyRequestsTable.id, id));

      return Response.json({
        message: "Buddy request rejected",
      });
    }
  } catch (error) {
    console.error("Buddy request action error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    // Delete the buddy request (only if user is the receiver)
    const result = await db
      .delete(buddyRequestsTable)
      .where(
        and(
          eq(buddyRequestsTable.id, id),
          eq(buddyRequestsTable.receiverId, user.id)
        )
      )
      .returning();

    if (result.length === 0) {
      return Response.json(
        { error: "Buddy request not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Buddy request deleted successfully",
    });
  } catch (error) {
    console.error("Delete buddy request error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
