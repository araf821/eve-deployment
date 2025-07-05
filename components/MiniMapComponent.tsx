"use client";

import { useGoogleMaps } from "./map/hooks";
import { MapLoadingState } from "./map";
import { MapPin } from "lucide-react";

interface MiniMapComponentProps {
  className?: string;
}

export default function MiniMapComponent({
  className = "",
}: MiniMapComponentProps) {
  const { mapRef, map, isClient } = useGoogleMaps({
    onMapReady: mapInstance => {
      // Configure mini map specific settings after a short delay to ensure marker is created first
      setTimeout(() => {
        if (mapInstance) {
          mapInstance.setOptions({
            gestureHandling: "none", // Disable all interactions
            disableDefaultUI: true, // Remove all UI controls
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        }
      }, 100);
    },
  });

  if (!isClient) {
    return (
      <div
        className={`relative flex items-center justify-center bg-gray-100 ${className}`}
      >
        <MapLoadingState message="Loading mini map..." />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <div ref={mapRef} className="h-full w-full" />

      {/* Location indicator overlay */}
      {map && (
        <div className="absolute top-2 left-2 flex items-center space-x-1 rounded-full bg-white/90 px-2 py-1 text-xs text-gray-700 shadow-sm backdrop-blur-sm">
          <MapPin className="h-3 w-3 text-blue-600" />
          <span>Current Location</span>
        </div>
      )}
    </div>
  );
}
