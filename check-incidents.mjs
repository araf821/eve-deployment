import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { alertsTable, usersTable } from "./server/db/schema";
import { eq, desc } from "drizzle-orm";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function checkIncidentLocations() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle({ client: sql });

    console.log("🔍 Querying all incident locations from database...\n");

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
      console.log("📭 No incidents found in the database.");
      return;
    }

    console.log(`📊 Found ${incidents.length} incident(s) in the database:\n`);

    incidents.forEach((incident, index) => {
      console.log(`📍 Incident #${index + 1}:`);
      console.log(`   ID: ${incident.id}`);
      console.log(`   User: ${incident.userName || 'Unknown'} (${incident.userEmail || 'No email'})`);
      console.log(`   Location: ${incident.lat}, ${incident.lng}`);
      console.log(`   Address: ${incident.address || 'No address'}`);
      console.log(`   Description: ${incident.description || 'No description'}`);
      console.log(`   Has Image: ${incident.hasImage}`);
      console.log(`   Created: ${incident.createdAt.toLocaleString()}`);
      console.log("");
    });

    // Summary statistics
    console.log("📈 Summary:");
    console.log(`   Total incidents: ${incidents.length}`);
    
    const recentIncidents = incidents.filter(incident => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return incident.createdAt > oneDayAgo;
    });
    console.log(`   Incidents in last 24 hours: ${recentIncidents.length}`);
    
    const incidentsWithImages = incidents.filter(incident => incident.hasImage === 'true');
    console.log(`   Incidents with images: ${incidentsWithImages.length}`);

  } catch (error) {
    console.error("❌ Error querying database:", error);
    process.exit(1);
  }
}

checkIncidentLocations(); 