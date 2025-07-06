const { neon } = require("@neondatabase/serverless");
require('dotenv').config();

async function deleteIncidents() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // First, let's see all alerts in the database
    console.log("📋 All alerts in the database:");
    const allAlerts = await sql`
      SELECT id, created_at, address, description
      FROM alert
      ORDER BY created_at DESC
    `;
    
    if (allAlerts.length === 0) {
      console.log("No alerts found in the database.");
      return;
    }
    
    allAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ID: ${alert.id}`);
      console.log(`   Created: ${alert.created_at}`);
      console.log(`   Address: ${alert.address || 'N/A'}`);
      console.log(`   Description: ${alert.description || 'N/A'}`);
      console.log('');
    });
    
    console.log("🔍 Attempting to delete alerts with these timestamps:");
    console.log("- 2025-07-05 23:50:28");
    console.log("- 2025-07-06 07:24:47");
    console.log("- 2025-07-05 23:51:36");
    console.log('');
    
    // Now attempt the deletion
    const result = await sql`
      DELETE FROM alert
      WHERE created_at IN (
        '2025-07-05 23:50:28',
        '2025-07-06 07:24:47',
        '2025-07-05 23:51:36'
      )
      RETURNING ID, created_at
    `;
    
    if (result.length === 0) {
      console.log("❌ No incidents deleted. Timestamps may not exist or may be in a different format.");
    } else {
      console.log(`✅ Deleted ${result.length} incident(s):`);
      result.forEach(row => console.log(` - ID: ${row.id}, Created: ${row.created_at}`));
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

deleteIncidents();