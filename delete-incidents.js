const { neon } = require("@neondatabase/serverless");
require('dotenv').config();

const INCIDENT_IDS = [
  'cfcc61a8-352d-4c88-b264-3774cb5be1c4',
  'b62130d0-c5fb-4d5e-8d5c-e1a9c9a65282',
];

async function deleteIncidents() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    return;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    console.log("🗑️ Deleting incidents:", INCIDENT_IDS);

    const result = await sql`
      DELETE FROM alert WHERE id = ANY(${INCIDENT_IDS})
      RETURNING id
    `;

    if (result.length === 0) {
      console.log("No incidents deleted. IDs may not exist.");
    } else {
      console.log(`Deleted ${result.length} incident(s):`);
      result.forEach(row => console.log(" -", row.id));
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

deleteIncidents(); 