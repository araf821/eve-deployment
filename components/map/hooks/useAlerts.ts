"use client";

import { useState, useRef, useCallback } from "react";

interface AlertStatus {
  type: "success" | "error" | "info" | null;
  message: string;
}

interface SelectedLocation {
  lat: number;
  lng: number;
  address?: string;
}

export function useAlerts() {
  const [alertStatus, setAlertStatus] = useState<AlertStatus>({
    type: null,
    message: "",
  });
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(
    null
  );
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const formatAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await new Promise<string>((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (
            results: google.maps.GeocoderResult[] | null,
            status: google.maps.GeocoderStatus
          ) => {
            if (status === "OK" && results?.[0]) {
              resolve(results[0].formatted_address);
            } else {
              reject("Geocoding failed");
            }
          }
        );
      });
      return response;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const showAlertStatus = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setAlertStatus({ type, message });
    setTimeout(() => setAlertStatus({ type: null, message: "" }), 3000);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveAlertToDatabase = async (
    lat: number,
    lng: number,
    onSuccess?: () => void
  ) => {
    try {
      console.log("Adding alert pin at position:", { lat, lng });

      // Get formatted address
      const address = await formatAddress(lat, lng);

      // Save to database
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat,
          lng,
          address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save alert");
      }

      await response.json();

      // Call success callback to reload alerts
      onSuccess?.();

      // Show success message
      showAlertStatus("success", "Alert pin added successfully!");
    } catch (error) {
      console.error("Error saving alert:", error);
      showAlertStatus("error", "Failed to save alert");
    }
  };

  const enablePlacementMode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (map: google.maps.Map, onSuccess?: () => void) => {
      if (!map || !window.google) {
        showAlertStatus("error", "Map not ready");
        return;
      }

      // Store map reference
      mapInstanceRef.current = map;

      // Set placement mode
      setIsPlacementMode(true);
      showAlertStatus("info", "Click on the map to place your incident report");

      // Change cursor to crosshair
      map.setOptions({ draggableCursor: "crosshair" });

      // Remove existing listener if any
      if (mapClickListenerRef.current) {
        google.maps.event.removeListener(mapClickListenerRef.current);
      }

      // Add click listener
      mapClickListenerRef.current = map.addListener(
        "click",
        async (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;

          const lat = event.latLng.lat();
          const lng = event.latLng.lng();

          // Get formatted address
          const address = await formatAddress(lat, lng);

          // Set selected location and show incident modal
          setSelectedLocation({ lat, lng, address });
          setShowIncidentModal(true);

          // Exit placement mode
          disablePlacementMode();
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const disablePlacementMode = useCallback(() => {
    setIsPlacementMode(false);

    // Reset cursor
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({ draggableCursor: undefined });
    }

    // Remove click listener
    if (mapClickListenerRef.current && window.google) {
      google.maps.event.removeListener(mapClickListenerRef.current);
      mapClickListenerRef.current = null;
    }
  }, []);

  const addAlertPin = useCallback(
    (map: google.maps.Map, onSuccess?: () => void) => {
      if (isPlacementMode) {
        // If already in placement mode, cancel it
        disablePlacementMode();
        showAlertStatus("info", "Incident report placement cancelled");
      } else {
        // Enable placement mode
        enablePlacementMode(map, onSuccess);
      }
    },
    [isPlacementMode, enablePlacementMode, disablePlacementMode]
  );

  const closeIncidentModal = useCallback(() => {
    setShowIncidentModal(false);
    setSelectedLocation(null);
  }, []);

  return {
    alertStatus,
    isPlacementMode,
    selectedLocation,
    showIncidentModal,
    addAlertPin,
    disablePlacementMode,
    closeIncidentModal,
    showAlertStatus,
  };
}
