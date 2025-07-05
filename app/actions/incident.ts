"use server"

import { redirect } from "next/navigation"

export async function submitIncidentReport(formData: FormData) {
  const description = formData.get("description") as string
  const location = formData.get("location") as string
  const image = formData.get("image") as File

  // Process the incident report here
  console.log("Incident Report:", {
    description,
    location,
    image: image.name || "No image",
  })

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Redirect back to dashboard with success message
  redirect("/?success=true")
}
