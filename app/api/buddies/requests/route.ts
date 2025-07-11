import { getCurrentUser } from "@/server/lib/auth";
import { db } from "@/server/db";
import { buddyRequestsTable, usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all pending buddy requests received by the user
    const receivedRequests = await db
      .select({
        id: buddyRequestsTable.id,
        nickname: buddyRequestsTable.nickname,
        phoneNumber: buddyRequestsTable.phoneNumber,
        status: buddyRequestsTable.status,
        createdAt: buddyRequestsTable.createdAt,
        sender: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          image: usersTable.image,
        },
      })
      .from(buddyRequestsTable)
      .innerJoin(usersTable, eq(buddyRequestsTable.senderId, usersTable.id))
      .where(eq(buddyRequestsTable.receiverId, user.id))
      .orderBy(buddyRequestsTable.createdAt);

    // Get all pending buddy requests sent by the user
    const sentRequests = await db
      .select({
        id: buddyRequestsTable.id,
        nickname: buddyRequestsTable.nickname,
        phoneNumber: buddyRequestsTable.phoneNumber,
        status: buddyRequestsTable.status,
        createdAt: buddyRequestsTable.createdAt,
        receiver: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          image: usersTable.image,
        },
      })
      .from(buddyRequestsTable)
      .innerJoin(usersTable, eq(buddyRequestsTable.receiverId, usersTable.id))
      .where(eq(buddyRequestsTable.senderId, user.id))
      .orderBy(buddyRequestsTable.createdAt);

    return Response.json({
      receivedRequests,
      sentRequests,
    });
  } catch (error) {
    console.error("Get buddy requests error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
