"use client";

import { useState } from "react";

interface AlertStatus {
  type: "success" | "error" | null;
  message: string;
}

export function useAlerts() {
  const [alertStatus, setAlertStatus] = useState<AlertStatus>({
    type: null,
    message: "",
  });

  const formatAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              resolve(results[0].formatted_address);
            } else {
              reject("Geocoding failed");
            }
          }
        );
      });
      return response as string;
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const showAlertStatus = (type: "success" | "error", message: string) => {
    setAlertStatus({ type, message });
    setTimeout(() => setAlertStatus({ type: null, message: "" }), 3000);
  };

  const addAlertPin = async (onSuccess?: () => void) => {
    if (!navigator.geolocation) {
      showAlertStatus("error", "Geolocation not available");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("Adding alert pin at position:", userPos);

        try {
          // Get formatted address
          const address = await formatAddress(userPos.lat, userPos.lng);

          // Save to database
          const response = await fetch("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: userPos.lat,
              lng: userPos.lng,
              address,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save alert");
          }

          const savedAlert = await response.json();

          // Call success callback to reload alerts
          onSuccess?.();

          // Show success message
          showAlertStatus("success", "Alert pin added successfully!");
        } catch (error) {
          console.error("Error saving alert:", error);
          showAlertStatus("error", "Failed to save alert");
        }
      },
      error => {
        console.error("Geolocation error:", error);
        showAlertStatus("error", "Failed to get your location");
      }
    );
  };

  return {
    alertStatus,
    addAlertPin,
    showAlertStatus,
  };
}
