"use client"

import { useEffect, useRef, useState } from "react"
import { getBuddyMarkerIcon } from "./buddyColors"

interface User {
  id: string
  name: string
  lat: string | number
  lng: string | number
}

interface UseUserMarkersProps {
  map: any
  isClient: boolean
}

export function useUserMarkers({ map, isClient }: UseUserMarkersProps) {
  const [users, setUsers] = useState<User[]>([])
  const markersRef = useRef<any[]>([])

  const loadUsers = async () => {
    console.log("Loading users...")
    try {
      const res = await fetch("/api/users")
      const usersData = await res.json()
      console.log("Users loaded:", usersData)
      setUsers(usersData)
    } catch (err) {
      console.error("Error loading users:", err)
    }
  }

  const clearUserMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
  }

  const createUserMarkers = () => {
    if (!map || !isClient) {
      console.log("Cannot create markers - map:", !!map, "isClient:", isClient)
      return
    }

    if (typeof window === "undefined" || !window.google) {
      console.log("Google Maps not available")
      return
    }

    // Clear existing user markers
    clearUserMarkers()

    console.log("Creating markers for users:", users.length)

    users.forEach((user, index) => {
      console.log(`Creating marker ${index + 1}:`, user.name, user.lat, user.lng)

      if (user.lat && user.lng) {
        try {
          const position = {
            lat: Number.parseFloat(user.lat.toString()),
            lng: Number.parseFloat(user.lng.toString()),
          }
          console.log("Parsed position:", position)

          const marker = new (window as any).google.maps.Marker({
            position,
            map,
            title: user.name,
            icon: getBuddyMarkerIcon(user.id, 40), // Use colored icon based on user ID
            animation: (window as any).google.maps.Animation.DROP,
          })

          // Create info window for user details
          const infoWindow = new (window as any).google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; min-width: 150px;">
                <h3 style="margin: 0 0 4px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                  ${user.name}
                </h3>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  User Location
                </p>
              </div>
            `,
          })

          marker.addListener("click", () => {
            // Close any open info windows
            markersRef.current.forEach((markerData) => {
              if (markerData.infoWindow) {
                markerData.infoWindow.close()
              }
            })

            infoWindow.open(map, marker)
            console.log(`Clicked marker for ${user.name}`)
          })

          // Store both marker and info window
          markersRef.current.push({
            marker: marker,
            infoWindow: infoWindow,
            user: user,
          })

          console.log(`Colored marker created successfully for ${user.name} at`, position)

          marker.setVisible(true)
          console.log("Marker visibility set to true")
        } catch (error) {
          console.error(`Error creating marker for ${user.name}:`, error)
        }
      } else {
        console.log(`Skipping marker for ${user.name} - missing coordinates`)
      }
    })

    console.log("Total user markers created:", markersRef.current.length)
  }

  const clearUserMarkersUpdated = () => {
    markersRef.current.forEach((markerData) => {
      markerData.marker.setMap(null)
      if (markerData.infoWindow) {
        markerData.infoWindow.close()
      }
    })
    markersRef.current = []
  }

  // Load users when map is ready
  useEffect(() => {
    if (map && isClient) {
      loadUsers()
    }
  }, [map, isClient])

  // Create markers when users are loaded
  useEffect(() => {
    if (users.length > 0 && map && isClient) {
      setTimeout(() => {
        createUserMarkers()
      }, 100)
    }
  }, [users, map, isClient])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearUserMarkersUpdated()
    }
  }, [])

  return {
    users,
    loadUsers,
    clearUserMarkers: clearUserMarkersUpdated,
    createUserMarkers,
  }
}
