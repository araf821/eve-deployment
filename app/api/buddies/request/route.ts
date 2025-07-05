import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/lib/auth";
import { db } from "@/server/db";
import {
  usersTable,
  buddyRequestsTable,
  buddyConnectionsTable,
} from "@/server/db/schema";
import { addBuddySchema } from "@/lib/validations/buddy";
import { eq, and, or } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = addBuddySchema.safeParse(body);

    if (!validatedData.success) {
      return Response.json(
        { error: "Invalid data", details: validatedData.error },
        { status: 400 }
      );
    }

    const { email, nickname, phoneNumber } = validatedData.data;

    // Check if user is trying to add themselves
    if (email.toLowerCase() === user.email?.toLowerCase()) {
      return Response.json(
        { error: "You cannot add yourself as a buddy" },
        { status: 400 }
      );
    }

    // Check if the target user exists
    const [targetUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()));

    if (!targetUser) {
      return Response.json(
        { error: "No user found with this email address" },
        { status: 404 }
      );
    }

    // Check if they're already buddies
    const existingConnection = await db
      .select()
      .from(buddyConnectionsTable)
      .where(
        or(
          and(
            eq(buddyConnectionsTable.userId, user.id),
            eq(buddyConnectionsTable.buddyId, targetUser.id)
          ),
          and(
            eq(buddyConnectionsTable.userId, targetUser.id),
            eq(buddyConnectionsTable.buddyId, user.id)
          )
        )
      );

    if (existingConnection.length > 0) {
      return Response.json(
        { error: "You are already buddies with this user" },
        { status: 400 }
      );
    }

    // Check if there's already a pending request
    const existingRequest = await db
      .select()
      .from(buddyRequestsTable)
      .where(
        or(
          and(
            eq(buddyRequestsTable.senderId, user.id),
            eq(buddyRequestsTable.receiverId, targetUser.id),
            eq(buddyRequestsTable.status, "pending")
          ),
          and(
            eq(buddyRequestsTable.senderId, targetUser.id),
            eq(buddyRequestsTable.receiverId, user.id),
            eq(buddyRequestsTable.status, "pending")
          )
        )
      );

    if (existingRequest.length > 0) {
      return Response.json(
        { error: "A buddy request already exists between you and this user" },
        { status: 400 }
      );
    }

    // Create the buddy request
    const [buddyRequest] = await db
      .insert(buddyRequestsTable)
      .values({
        senderId: user.id,
        receiverId: targetUser.id,
        nickname,
        phoneNumber,
        status: "pending",
      })
      .returning();

    return Response.json({
      message: "Buddy request sent successfully",
      request: buddyRequest,
    });
  } catch (error) {
    console.error("Buddy request error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
