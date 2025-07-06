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

// Helper function to check if an alert should be excluded based on timestamp
const shouldExcludeAlert = (alert: AlertData): boolean => {
  const timestamp = alert.createdAt;
  
  // Convert to local time string for comparison
  const localTimeString = timestamp.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Define the timestamps to exclude
  const excludedTimestamps = [
    '2025-07-05 23:50:28', // 2025-07-05 at 11:50:28 p.m.
    '2025-07-06 07:24:47', // 2025-07-06 at 7:24:47 a.m.
    '2025-07-05 23:51:36', // 2025-07-05 at 11:51:36 p.m.
  ];
  
  return excludedTimestamps.includes(localTimeString);
};

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

    // Filter out excluded alerts
    const filteredAlerts = alerts.filter(alert => !shouldExcludeAlert(alert));
    
    console.log("Creating alert markers:", filteredAlerts.length, "out of", alerts.length, "total alerts");

    filteredAlerts.forEach(alert => {
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
