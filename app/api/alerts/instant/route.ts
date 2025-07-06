import { db } from "@/server/db"
import { alertsTable, usersTable, buddyConnectionsTable } from "@/server/db/schema"
import { getCurrentUser } from "@/server/lib/auth"
import { sendBulkSMS, createIncidentAlertMessage } from "@/lib/sms"
import { eq } from "drizzle-orm"

// Function to get address from coordinates using Google Geocoding API
async function getAddressFromCoordinates(lat: number, lng: number): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not found, using coordinates");
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === "OK" && data.results && data.results.length > 0) {
      // Get the most relevant result (usually the first one)
      const address = data.results[0].formatted_address;
      console.log("Geocoded address:", address);
      return address;
    } else {
      console.warn("Geocoding failed, using coordinates:", data.status);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  } catch (error) {
    console.error("Error in geocoding:", error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.error("User not authenticated")
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { lat, lng, address } = body

    console.log("Instant alert request body:", body)
    console.log("Instant alert request parsed:", { userId: user.id, lat, lng, address })

    // Get user's current location if not provided
    let userLat = lat
    let userLng = lng
    let userAddress = address

    if (!userLat || !userLng) {
      console.log("No location provided, getting from database")
      // Get user's last known location from database
      const userRecord = await db
        .select({ lat: usersTable.lat, lng: usersTable.lng })
        .from(usersTable)
        .where(eq(usersTable.id, user.id))
        .limit(1)

      console.log("User record from DB:", userRecord[0])

      if (userRecord[0]?.lat && userRecord[0]?.lng) {
        userLat = userRecord[0].lat
        userLng = userRecord[0].lng
        userAddress = await getAddressFromCoordinates(userLat, userLng)
        console.log("Using location from DB:", { userLat, userLng, userAddress })
      } else {
        console.error("No location available in database")
        // Instead of failing, use a default location or create a generic alert
        userLat = 0
        userLng = 0
        userAddress = "Location unknown - user needs immediate assistance"
        console.log("Using fallback location:", { userLat, userLng, userAddress })
      }
    } else {
      // Location was provided in the request
      if (userLat && userLng) {
        userAddress = await getAddressFromCoordinates(userLat, userLng)
        console.log("Using provided location:", { userLat, userLng, userAddress })
      } else {
        console.error("Invalid location provided in request")
        userLat = 0
        userLng = 0
        userAddress = "Location unknown - user needs immediate assistance"
        console.log("Using fallback location due to invalid request:", { userLat, userLng, userAddress })
      }
    }

    console.log("Creating alert in database with:", { userId: user.id, lat: userLat, lng: userLng, address: userAddress })
    
    // Create alert in database
    const [alert] = await db
      .insert(alertsTable)
      .values({
        userId: user.id,
        lat: userLat,
        lng: userLng,
        address: userAddress,
      })
      .returning()

    console.log("Alert created in database:", alert)
    console.log("Alert address field:", alert.address)

    // Get all buddies with phone numbers
    const buddies = await db
      .select({
        phoneNumber: buddyConnectionsTable.phoneNumber,
        nickname: buddyConnectionsTable.nickname,
      })
      .from(buddyConnectionsTable)
      .where(eq(buddyConnectionsTable.userId, user.id))
      .orderBy(buddyConnectionsTable.createdAt)

    console.log("Found buddies:", buddies)

    // Filter out buddies without phone numbers
    const buddiesWithPhones = buddies.filter(buddy => buddy.phoneNumber)

    console.log("Buddies with phones:", buddiesWithPhones)

    if (buddiesWithPhones.length === 0) {
      console.error("No buddies with phone numbers found")
      return new Response("No buddies with phone numbers found", { status: 400 })
    }

    // Create SMS messages for all buddies
    const timestamp = new Date().toLocaleString()
    console.log("Creating SMS with address:", userAddress)
    
    const messages = buddiesWithPhones.map(buddy => {
      const messageBody = createIncidentAlertMessage(
        user.name || "A friend",
        userAddress,
        timestamp
      )
      console.log(`SMS for ${buddy.nickname}:`, messageBody)
      return {
        to: buddy.phoneNumber!,
        body: messageBody
      }
    })

    console.log("SMS messages to send:", messages)

    // Send SMS to all buddies
    const smsResults = await sendBulkSMS(messages)

    console.log("SMS results:", smsResults)

    // Check if Twilio is configured
    if (smsResults.success.length === 0 && smsResults.failed.length > 0) {
      console.warn("SMS failed - Twilio credentials may not be configured")
      // Still return success for the alert creation, but warn about SMS
      return Response.json({
        alert,
        smsResults,
        message: `Alert created successfully, but SMS failed. Please check Twilio configuration.`,
        warning: "SMS not sent - Twilio credentials may be missing"
      })
    }

    return Response.json({
      alert,
      smsResults,
      message: `Alert sent to ${smsResults.success.length} buddies`
    })
  } catch (error) {
    console.error("Error creating instant alert:", error)
    return new Response(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 })
  }
} 