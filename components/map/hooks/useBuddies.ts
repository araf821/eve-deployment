"use client"

import { useState, useEffect } from "react"

interface Buddy {
  id: string
  nickname: string
  phoneNumber?: string
  lat?: string
  lng?: string
  name?: string
  email?: string
  image?: string
  lastSeen?: Date
  createdAt?: Date
}

export function useBuddies() {
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBuddies = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/buddies")

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, just return empty array
          setBuddies([])
          setError(null)
          return
        }

        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to load buddies")
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format")
      }

      const responseData = await response.json()

      // Handle both response formats: direct array or { buddies: array }
      let buddiesData: Buddy[]
      if (Array.isArray(responseData)) {
        buddiesData = responseData
      } else if (responseData.buddies && Array.isArray(responseData.buddies)) {
        buddiesData = responseData.buddies
      } else {
        console.warn("Unexpected response format:", responseData)
        buddiesData = []
      }

      setBuddies(buddiesData)
      setError(null)
    } catch (err) {
      console.error("Error loading buddies:", err)
      setError(err instanceof Error ? err.message : "Failed to load buddies")
      setBuddies([]) // Ensure empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBuddies()
  }, [])

  return {
    buddies: Array.isArray(buddies) ? buddies : [], // Extra safety check
    loading,
    error,
    refetch: loadBuddies,
  }
}
