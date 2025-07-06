const { neon } = require("@neondatabase/serverless");
require('dotenv').config();

async function checkIncidents() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log("🔍 Querying all incident locations...\n");

    // Get all incidents with user info
    const incidents = await sql`
      SELECT 
        a.id,
        a.user_id,
        u.name as user_name,
        u.email as user_email,
        a.lat,
        a.lng,
        a.address,
        a.description,
        a.has_image,
        a.created_at
      FROM alert a
      LEFT JOIN "user" u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `;

    if (incidents.length === 0) {
      console.log("📭 No incidents found in the database.");
      return;
    }

    console.log(`📊 Found ${incidents.length} incident(s):\n`);

    incidents.forEach((incident, index) => {
      console.log(`📍 Incident #${index + 1}:`);
      console.log(`   ID: ${incident.id}`);
      console.log(`   User: ${incident.user_name || 'Unknown'} (${incident.user_email || 'No email'})`);
      console.log(`   Location: ${incident.lat}, ${incident.lng}`);
      console.log(`   Address: ${incident.address || 'No address'}`);
      console.log(`   Description: ${incident.description || 'No description'}`);
      console.log(`   Has Image: ${incident.has_image}`);
      console.log(`   Created: ${new Date(incident.created_at).toLocaleString()}`);
      console.log("");
    });

    // Get summary stats
    const stats = await sql`
      SELECT 
        COUNT(*) as total_incidents,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as incidents_last_24h,
        COUNT(CASE WHEN has_image = 'true' THEN 1 END) as incidents_with_images
      FROM alert
    `;

    console.log("📈 Summary:");
    console.log(`   Total incidents: ${stats[0].total_incidents}`);
    console.log(`   Incidents in last 24 hours: ${stats[0].incidents_last_24h}`);
    console.log(`   Incidents with images: ${stats[0].incidents_with_images}`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkIncidents(); 