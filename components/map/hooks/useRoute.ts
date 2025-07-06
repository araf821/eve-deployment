"use client";

import { useState, useRef, useCallback } from "react";

interface RoutePoint {
  lat: number;
  lng: number;
  address?: string;
}

interface UseRouteProps {
  map?: google.maps.Map;
  onRouteComplete?: () => void;
}

export function useRoute({ map, onRouteComplete }: UseRouteProps = {}) {
  const [isRouteMode, setIsRouteMode] = useState(false);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [routeStatus, setRouteStatus] = useState<string>("");
  
  // Refs for cleanup
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const routeMarkersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any | null>(null);
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

  const clearRoute = useCallback(() => {
    // Clear route markers
    routeMarkersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    routeMarkersRef.current = [];

    // Clear route line
    if (routeLineRef.current) {
      routeLineRef.current.setMap(null);
      routeLineRef.current = null;
    }

    // Reset state
    setRoutePoints([]);
    setRouteStatus("");
  }, []);

  const drawRouteLine = useCallback((pointA: RoutePoint, pointB: RoutePoint) => {
    if (!map || !window.google) return;

    // Create a simple straight line between the two points
    const routeLine = new google.maps.Polyline({
      path: [
        { lat: pointA.lat, lng: pointA.lng },
        { lat: pointB.lat, lng: pointB.lng }
      ],
      geodesic: true,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map
    });

    routeLineRef.current = routeLine;

    // Fit map to show both points
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: pointA.lat, lng: pointA.lng });
    bounds.extend({ lat: pointB.lat, lng: pointB.lng });
    map.fitBounds(bounds);

    // Add some padding to the bounds
    const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
      if (map.getZoom() > 15) {
        map.setZoom(15);
      }
      google.maps.event.removeListener(listener);
    });
  }, [map]);

  const disableRouteMode = useCallback(() => {
    setIsRouteMode(false);
    setRouteStatus("");

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

  const enableRouteMode = useCallback(() => {
    if (!map || !window.google) {
      setRouteStatus("Map not ready");
      return;
    }

    // Store map reference
    mapInstanceRef.current = map;

    // Clear any existing route
    clearRoute();

    // Set route mode
    setIsRouteMode(true);
    setRouteStatus("Select point A");
    setRoutePoints([]);

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

        const newPoint: RoutePoint = { lat, lng, address };

        // Add point to route using functional update
        setRoutePoints(prevPoints => {
          const updatedPoints = [...prevPoints, newPoint];
          
          // Create marker for the point
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            title: `Point ${updatedPoints.length === 1 ? 'A' : 'B'}`,
            label: {
              text: updatedPoints.length === 1 ? 'A' : 'B',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: updatedPoints.length === 1 ? '#3B82F6' : '#10B981',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2
            }
          });

          routeMarkersRef.current.push(marker);

          // Update status
          if (updatedPoints.length === 1) {
            setRouteStatus("Select point B");
          } else if (updatedPoints.length === 2) {
            // Draw route line
            drawRouteLine(updatedPoints[0], updatedPoints[1]);
            setRouteStatus("Route created");
            
            // Exit route mode after a delay
            setTimeout(() => {
              disableRouteMode();
              onRouteComplete?.();
            }, 2000);
          }

          return updatedPoints;
        });
      }
    );
  }, [map, clearRoute, drawRouteLine, disableRouteMode, onRouteComplete]);

  return {
    isRouteMode,
    routePoints,
    routeStatus,
    enableRouteMode,
    disableRouteMode,
    clearRoute
  };
} 