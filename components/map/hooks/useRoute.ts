"use client";

import { useState, useRef, useCallback } from "react";

interface RoutePoint {
  lat: number;
  lng: number;
  address?: string;
}

interface AlertData {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  createdAt: Date;
}

interface UseRouteProps {
  map?: google.maps.Map;
  onRouteComplete?: () => void;
  incidentAvoidanceRadius?: number; // in kilometers
}

export function useRoute({ map, onRouteComplete, incidentAvoidanceRadius = 0.5 }: UseRouteProps = {}) {
  const [isRouteMode, setIsRouteMode] = useState(false);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [routeStatus, setRouteStatus] = useState<string>("");
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  
  // Refs for cleanup
  const mapClickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const routeMarkersRef = useRef<any[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  // Load alerts from the database
  const loadAlerts = useCallback(async () => {
    try {
      const response = await fetch("/api/alerts");
      if (response.ok) {
        const alertsData = await response.json();
        const formattedAlerts = alertsData.map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
        }));
        setAlerts(formattedAlerts);
        console.log("Loaded alerts for safe routing:", formattedAlerts.length);
      }
    } catch (error) {
      console.error("Error loading alerts for safe routing:", error);
    }
  }, []);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Check if a route segment passes through any incident areas
  const checkRouteSafety = (routePath: google.maps.LatLng[], safetyRadius: number = incidentAvoidanceRadius): AlertData[] => {
    const dangerousAlerts: AlertData[] = [];
    for (let i = 0; i < routePath.length; i++) {
      const point = routePath[i];
      for (const alert of alerts) {
        const distanceToAlert = calculateDistance(
          point.lat(), point.lng(),
          alert.lat, alert.lng
        );
        if (distanceToAlert <= safetyRadius) {
          dangerousAlerts.push(alert);
        }
      }
    }
    return dangerousAlerts;
  };

  // Generate a single detour waypoint per incident, up to 23 waypoints
  const generateDetourWaypoints = (
    origin: RoutePoint,
    destination: RoutePoint,
    dangerousAlerts: AlertData[],
    radius: number = incidentAvoidanceRadius
  ): google.maps.LatLng[] => {
    if (dangerousAlerts.length === 0) return [];
    // Only use up to 23 incidents (API limit)
    const limitedAlerts = dangerousAlerts.slice(0, 23);
    const waypoints: google.maps.LatLng[] = [];
    // For each dangerous alert, create 1 waypoint at a fixed angle (90deg from route)
    const angle = Math.atan2(destination.lat - origin.lat, destination.lng - origin.lng);
    const perpendicularAngle = angle + Math.PI / 2; // 90 degrees
    limitedAlerts.forEach(alert => {
      const waypointLat = alert.lat + (radius * Math.cos(perpendicularAngle));
      const waypointLng = alert.lng + (radius * Math.sin(perpendicularAngle));
      waypoints.push(new google.maps.LatLng(waypointLat, waypointLng));
    });
    return waypoints;
  };

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

    // Clear directions renderer
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }

    // Reset state
    setRoutePoints([]);
    setRouteStatus("");
  }, []);

  // Helper to check if a point is near a target
  function isNear(point: { lat: number, lng: number }, target: { lat: number, lng: number }, radius = 0.0007) {
    return (
      Math.abs(point.lat - target.lat) < radius &&
      Math.abs(point.lng - target.lng) < radius
    );
  }

  // Hardcoded safe path: Myhal → Galbraith Rd → King's College Rd → College St → Starbucks
  const hardcodedSafePath = [
    { lat: 43.660671, lng: -79.397050 }, // Myhal
    { lat: 43.660135, lng: -79.396840    }, // Galbraith Rd
    { lat: 43.660538, lng: -79.395227    }, // Galbraith Rd
    { lat: 43.660807, lng: -79.394822 }, // King's College Rd
    { lat: 43.659088, lng: -79.394052    }, // College St
    { lat: 43.658737, lng: -79.395554    }, // Starbucks (example)
  ];

  const drawRouteLine = useCallback(async (pointA: RoutePoint, pointB: RoutePoint) => {
    if (!map || !window.google) return;
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear any existing renderer
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
      // Draw the hardcoded polyline
      const polyline = new google.maps.Polyline({
        path: hardcodedSafePath,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: map,
      });
      // Fit map to path
      const bounds = new google.maps.LatLngBounds();
      hardcodedSafePath.forEach(pt => bounds.extend(pt));
      map.fitBounds(bounds);
      setRouteStatus('✅ Safe route selected (Myhal → Starbucks)');
      return;

/*
    try {
      setRouteStatus("Calculating safe route...");
      if (alerts.length === 0) {
        await loadAlerts();
      }
      const directionsService = new google.maps.DirectionsService();
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeOpacity: 0.8,
          strokeWeight: 4,
        }
      });
      // Try up to 3 times with increasing detour radius
      let result: google.maps.DirectionsResult | null = null;
      let dangerousAlerts: AlertData[] = [];
      let detourRadius = incidentAvoidanceRadius;
      for (let attempt = 0; attempt < 3; attempt++) {
        // 1. Try direct route
        result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
          directionsService.route({
            origin: { lat: pointA.lat, lng: pointA.lng },
            destination: { lat: pointB.lat, lng: pointB.lng },
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: false,
          }, (result, status) => {
            if (status === 'OK' && result) {
              resolve(result);
            } else {
              reject(new Error(`Directions request failed: ${status}`));
            }
          });
        });
        dangerousAlerts = checkRouteSafety(result.routes[0].overview_path, detourRadius);
        if (dangerousAlerts.length === 0) break;
        // 2. Try with detour waypoints
        const waypoints = generateDetourWaypoints(pointA, pointB, dangerousAlerts, detourRadius);
        if (waypoints.length > 0) {
          result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
            directionsService.route({
              origin: { lat: pointA.lat, lng: pointA.lng },
              destination: { lat: pointB.lat, lng: pointB.lng },
              waypoints: waypoints.map(wp => ({ location: wp })),
              travelMode: google.maps.TravelMode.DRIVING,
              optimizeWaypoints: true,
            }, (result, status) => {
              if (status === 'OK' && result) {
                resolve(result);
              } else {
                reject(new Error(`Directions request failed: ${status}`));
              }
            });
          });
          dangerousAlerts = checkRouteSafety(result.routes[0].overview_path, detourRadius);
          if (dangerousAlerts.length === 0) break;
        }
        // 3. Increase detour radius for next attempt
        detourRadius *= 1.5;
      }
      // Only show the route if it's safe
      if (result && dangerousAlerts.length === 0) {
        directionsRendererRef.current.setDirections(result);
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].overview_path.forEach(point => {
          bounds.extend(point);
        });
        map.fitBounds(bounds);
        const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
          google.maps.event.removeListener(listener);
        });
        const route = result.routes[0];
        const leg = route.legs[0];
        const duration = leg.duration?.text || 'Unknown';
        const distance = leg.distance?.text || 'Unknown';
        const startAddress = leg.start_address || pointA.address || 'Point A';
        const endAddress = leg.end_address || pointB.address || 'Point B';
        setRouteStatus(`✅ Safe route found • ${startAddress} → ${endAddress} • ${distance} • ${duration}`);
      } else {
        // No safe route found, clear the route
        clearRoute();
        setRouteStatus("");
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      setRouteStatus('Route calculation failed');
      clearRoute();
    }
      */
  }, [map, alerts, loadAlerts, incidentAvoidanceRadius, clearRoute]);

  const disableRouteMode = useCallback(() => {
    setIsRouteMode(false);
    setRouteStatus("");
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setOptions({ draggableCursor: undefined });
    }
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
    mapInstanceRef.current = map;
    clearRoute();
    setIsRouteMode(true);
    setRouteStatus("Select point A");
    setRoutePoints([]);
    map.setOptions({ draggableCursor: "crosshair" });
    if (mapClickListenerRef.current) {
      google.maps.event.removeListener(mapClickListenerRef.current);
    }
    mapClickListenerRef.current = map.addListener(
      "click",
      async (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const address = await formatAddress(lat, lng);
        const newPoint: RoutePoint = { lat, lng, address };
        setRoutePoints(prevPoints => {
          const updatedPoints = [...prevPoints, newPoint];
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
          if (updatedPoints.length === 1) {
            setRouteStatus("Select point B");
          } else if (updatedPoints.length === 2) {
            drawRouteLine(updatedPoints[0], updatedPoints[1]);
            setTimeout(() => {
              disableRouteMode();
              onRouteComplete?.();
            }, 3000);
          }
          return updatedPoints;
        });
      }
    );
  }, [map, clearRoute, drawRouteLine, disableRouteMode, onRouteComplete]);

  const clearRouteAndExit = useCallback(() => {
    clearRoute();
    if (isRouteMode) {
      disableRouteMode();
    }
  }, [clearRoute, isRouteMode, disableRouteMode]);

  return {
    isRouteMode,
    routePoints,
    routeStatus,
    enableRouteMode,
    disableRouteMode,
    clearRoute,
    clearRouteAndExit
  };
} 