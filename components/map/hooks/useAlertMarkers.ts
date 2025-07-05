"use client";

import { useEffect, useRef, useState } from "react";

interface AlertData {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  address?: string;
  createdAt: Date;
  userName?: string;
  marker?: any;
}

interface UseAlertMarkersProps {
  map: any;
  isClient: boolean;
  onAlertClick?: (alert: AlertData) => void;
}

export function useAlertMarkers({
  map,
  isClient,
  onAlertClick,
}: UseAlertMarkersProps) {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const alertMarkersRef = useRef<any[]>([]);

  const loadAlerts = async () => {
    console.log("Loading alerts...");
    try {
      const res = await fetch("/api/alerts");
      const alertsData = await res.json();
      console.log("Alerts loaded:", alertsData);

      const formattedAlerts = alertsData.map((alert: any) => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
      }));

      setAlerts(formattedAlerts);
    } catch (err) {
      console.error("Error loading alerts:", err);
    }
  };

  const clearAlertMarkers = () => {
    alertMarkersRef.current.forEach(marker => marker.setMap(null));
    alertMarkersRef.current = [];
  };

  const createAlertMarkers = () => {
    if (!map || !isClient || !window.google) {
      return;
    }

    // Clear existing alert markers
    clearAlertMarkers();

    console.log("Creating alert markers:", alerts.length);

    alerts.forEach(alert => {
      const position = { lat: alert.lat, lng: alert.lng };

      const alertMarker = new (window as any).google.maps.Marker({
        position,
        map,
        title: `Alert by ${alert.userName || "Unknown User"}`,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new (window as any).google.maps.Size(32, 32),
        },
      });

      // Add click listener to show modal
      alertMarker.addListener("click", () => {
        onAlertClick?.(alert);
      });

      // Store marker reference in alert data
      alert.marker = alertMarker;
      alertMarkersRef.current.push(alertMarker);
    });

    console.log("Total alert markers created:", alertMarkersRef.current.length);
  };

  // Load alerts when map is ready
  useEffect(() => {
    if (map && isClient) {
      loadAlerts();
    }
  }, [map, isClient]);

  // Create markers when alerts are loaded
  useEffect(() => {
    if (alerts.length > 0 && map && isClient) {
      setTimeout(() => {
        createAlertMarkers();
      }, 100);
    }
  }, [alerts, map, isClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAlertMarkers();
    };
  }, []);

  return {
    alerts,
    loadAlerts,
    clearAlertMarkers,
    createAlertMarkers,
  };
}
