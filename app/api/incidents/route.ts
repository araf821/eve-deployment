import { NextResponse } from "next/server";
import { db } from "../../../server/db";
import { alertsTable, usersTable } from "../../../server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    console.log("🔍 Querying all incident locations from database...");

    // Query all alerts with user information
    const incidents = await db
      .select({
        id: alertsTable.id,
        userId: alertsTable.userId,
        userName: usersTable.name,
        userEmail: usersTable.email,
        lat: alertsTable.lat,
        lng: alertsTable.lng,
        address: alertsTable.address,
        description: alertsTable.description,
        hasImage: alertsTable.hasImage,
        createdAt: alertsTable.createdAt,
      })
      .from(alertsTable)
      .leftJoin(usersTable, eq(alertsTable.userId, usersTable.id))
      .orderBy(desc(alertsTable.createdAt));

    if (incidents.length === 0) {
      return NextResponse.json({
        message: "No incidents found in the database",
        incidents: [],
        summary: {
          total: 0,
          last24Hours: 0,
          withImages: 0,
        }
      });
    }

    // Calculate summary statistics
    const recentIncidents = incidents.filter(incident => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return incident.createdAt > oneDayAgo;
    });

    const incidentsWithImages = incidents.filter(incident => incident.hasImage === 'true');

    const summary = {
      total: incidents.length,
      last24Hours: recentIncidents.length,
      withImages: incidentsWithImages.length,
    };

    return NextResponse.json({
      message: `Found ${incidents.length} incident(s) in the database`,
      incidents,
      summary,
    });

  } catch (error) {
    console.error("❌ Error querying database:", error);
    return NextResponse.json(
      { error: "Failed to query incidents" },
      { status: 500 }
    );
  }
} 