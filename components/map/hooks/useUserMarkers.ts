"use client";

import { useEffect, useRef, useState } from "react";

interface User {
  id: string;
  name: string;
  lat: string | number;
  lng: string | number;
}

interface UseUserMarkersProps {
  map: any;
  isClient: boolean;
}

export function useUserMarkers({ map, isClient }: UseUserMarkersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const markersRef = useRef<any[]>([]);

  const loadUsers = async () => {
    console.log("Loading users...");
    try {
      const res = await fetch("/api/users");
      const usersData = await res.json();
      console.log("Users loaded:", usersData);
      setUsers(usersData);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const clearUserMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const createUserMarkers = () => {
    if (!map || !isClient) {
      console.log("Cannot create markers - map:", !!map, "isClient:", isClient);
      return;
    }

    if (typeof window === "undefined" || !window.google) {
      console.log("Google Maps not available");
      return;
    }

    // Clear existing user markers
    clearUserMarkers();

    console.log("Creating markers for users:", users.length);

    users.forEach((user, index) => {
      console.log(
        `Creating marker ${index + 1}:`,
        user.name,
        user.lat,
        user.lng
      );

      if (user.lat && user.lng) {
        try {
          const position = {
            lat: Number.parseFloat(user.lat.toString()),
            lng: Number.parseFloat(user.lng.toString()),
          };
          console.log("Parsed position:", position);

          const marker = new (window as any).google.maps.Marker({
            position,
            map,
            title: user.name,
          });

          marker.addListener("click", () => {
            console.log(`Clicked marker for ${user.name}`);
            alert(`Clicked marker for ${user.name}`);
          });

          markersRef.current.push(marker);
          console.log(
            `Marker created successfully for ${user.name} at`,
            position
          );

          marker.setVisible(true);
          console.log("Marker visibility set to true");
        } catch (error) {
          console.error(`Error creating marker for ${user.name}:`, error);
        }
      } else {
        console.log(`Skipping marker for ${user.name} - missing coordinates`);
      }
    });

    console.log("Total user markers created:", markersRef.current.length);
  };

  // Load users when map is ready
  useEffect(() => {
    if (map && isClient) {
      loadUsers();
    }
  }, [map, isClient]);

  // Create markers when users are loaded
  useEffect(() => {
    if (users.length > 0 && map && isClient) {
      setTimeout(() => {
        createUserMarkers();
      }, 100);
    }
  }, [users, map, isClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearUserMarkers();
    };
  }, []);

  return {
    users,
    loadUsers,
    clearUserMarkers,
    createUserMarkers,
  };
}
