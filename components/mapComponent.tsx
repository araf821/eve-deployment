"use client";

import {
  useGoogleMaps,
  useUserMarkers,
  useAlertMarkers,
  useAlerts,
  useAlertModal,
  useLocation,
  useRoute,
} from "./map/hooks";
import { useBuddies } from "./map/hooks/useBuddies";
import {
  MapFab,
  MapSearch,
  MapStatusIndicator,
  AlertModal,
  MapLoadingState,
} from "./map";
import { IncidentReportModal } from "./map/IncidentReportModal";
import { getBuddyMarkerIcon } from "@/components/map/hooks/buddyColors";
import { useRef, useState } from "react";

interface SearchResult {
  placeId: string;
  description: string;
  lat: number;
  lng: number;
}

interface Buddy {
  id: string;
  nickname: string;
  phoneNumber?: string;
  lat?: string;
  lng?: string;
  name?: string;
  lastSeen?: Date;
}

export default function MapComponent() {
  const { updateLocation } = useLocation();
  const { mapRef, map, isClient } = useGoogleMaps({
    onLocationUpdate: updateLocation,
  });

  useUserMarkers({ map, isClient });
  const { loadAlerts } = useAlertMarkers({
    map,
    isClient,
    onAlertClick: alert => openModal(alert),
  });

  const {
    alertStatus,
    isPlacementMode,
    selectedLocation,
    showIncidentModal,
    addAlertPin,
    closeIncidentModal,
  } = useAlerts();
  const { selectedAlert, isModalOpen, openModal, closeModal } = useAlertModal();
  const { buddies, loading: buddiesLoading } = useBuddies();

  // Route functionality
  const {
    isRouteMode,
    routeStatus,
    enableRouteMode,
    disableRouteMode,
    clearRoute,
  } = useRoute({
    map,
    onRouteComplete: () => {
      console.log("Route creation completed");
    },
  });

  // State and refs for buddy markers
  const [showingBuddies, setShowingBuddies] = useState(false);
  const buddyMarkersRef = useRef<any[]>([]);
  const lastSelectedBuddyRef = useRef<string | null>(null);

  const clearBuddyMarkers = () => {
    buddyMarkersRef.current.forEach(markerData => {
      markerData.marker.setMap(null);
      if (markerData.infoWindow) {
        markerData.infoWindow.close();
      }
    });
    buddyMarkersRef.current = [];
  };

  const createBuddyMarkers = () => {
    if (!map || !isClient || !window.google) {
      return;
    }

    // Clear existing buddy markers
    clearBuddyMarkers();

    console.log("Creating buddy markers:", buddies.length);

    const validBuddies = buddies.filter(buddy => buddy.lat && buddy.lng);

    if (validBuddies.length === 0) {
      console.log("No buddies with valid locations found");
      return;
    }

    const bounds = new (window as any).google.maps.LatLngBounds();

    validBuddies.forEach(buddy => {
      const position = {
        lat: Number.parseFloat(buddy.lat!),
        lng: Number.parseFloat(buddy.lng!),
      };

      const buddyMarker = new (window as any).google.maps.Marker({
        position,
        map,
        title: `${buddy.nickname} - ${buddy.name || "Unknown"}`,
        icon: getBuddyMarkerIcon(buddy.id, 40),
        animation: (window as any).google.maps.Animation.DROP,
      });

      // Create info window for buddy details
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
            ${buddy.nickname}
          </h3>
          ${buddy.name ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${buddy.name}</p>` : ""}
          ${buddy.phoneNumber ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">📞 ${buddy.phoneNumber}</p>` : ""}
          ${buddy.lastSeen ? `<p style="margin: 0; color: #9ca3af; font-size: 12px;">Last seen: ${new Date(buddy.lastSeen).toLocaleDateString()}</p>` : ""}
        </div>
      `,
      });

      // Add click listener to show info window
      buddyMarker.addListener("click", () => {
        // Close any open info windows
        buddyMarkersRef.current.forEach(markerData => {
          if (markerData.infoWindow) {
            markerData.infoWindow.close();
          }
        });

        infoWindow.open(map, buddyMarker);
      });

      // Store marker and info window references
      buddyMarkersRef.current.push({
        marker: buddyMarker,
        infoWindow: infoWindow,
        buddy: buddy,
        isTemporary: false,
      });

      // Extend bounds to include this buddy's location
      bounds.extend(position);
    });

    // Fit map to show all buddy markers
    if (validBuddies.length > 0) {
      map.fitBounds(bounds);

      // Set a maximum zoom level to avoid zooming in too much for a single buddy
      const listener = (window as any).google.maps.event.addListener(
        map,
        "bounds_changed",
        () => {
          if (map.getZoom() > 15) {
            map.setZoom(15);
          }
          (window as any).google.maps.event.removeListener(listener);
        }
      );
    }

    console.log("Total buddy markers created:", buddyMarkersRef.current.length);
  };

  const handleAddAlertPin = () => {
    if (map) {
      addAlertPin(map, () => {
        loadAlerts();
      });
    }
  };

  const handleFindBuddies = () => {
    if (!map || buddiesLoading) {
      console.log("Map not ready or buddies still loading");
      return;
    }

    if (showingBuddies) {
      // Hide buddy markers
      clearBuddyMarkers();
      setShowingBuddies(false);
      console.log("Buddy markers hidden");
    } else {
      // Show buddy markers
      createBuddyMarkers();
      setShowingBuddies(true);
      console.log("Buddy markers displayed");
    }
  };

  const handleFindRoute = () => {
    if (!map) {
      console.log("Map not ready");
      return;
    }

    if (isRouteMode) {
      // If already in route mode, disable it
      disableRouteMode();
      clearRoute();
      console.log("Route mode disabled");
    } else {
      // Enable route mode
      enableRouteMode();
      console.log("Route mode enabled");
    }
  };

  const handleBuddySelect = (buddy: Buddy) => {
    // Prevent rapid duplicate selections
    if (lastSelectedBuddyRef.current === buddy.id) {
      return;
    }
    lastSelectedBuddyRef.current = buddy.id;

    // Clear the selection after a short delay
    setTimeout(() => {
      lastSelectedBuddyRef.current = null;
    }, 1000);

    if (map && buddy.lat && buddy.lng) {
      // Center map on buddy's location
      const position = {
        lat: Number.parseFloat(buddy.lat),
        lng: Number.parseFloat(buddy.lng),
      };
      map.setCenter(position);
      map.setZoom(15);

      // If not already showing buddies, create a temporary marker
      if (!showingBuddies) {
        // Clear ALL existing temporary markers first to prevent any duplicates
        buddyMarkersRef.current = buddyMarkersRef.current.filter(markerData => {
          if (markerData.isTemporary) {
            markerData.marker.setMap(null);
            if (markerData.infoWindow) {
              markerData.infoWindow.close();
            }
            return false;
          }
          return true;
        });

        // Small delay to ensure previous markers are fully cleared
        setTimeout(() => {
          // Double-check that no marker exists for this buddy before creating
          const existingMarker = buddyMarkersRef.current.find(
            markerData => markerData.buddy?.id === buddy.id
          );
          if (existingMarker) {
            // If marker already exists, just focus on it
            map.setCenter(position);
            if (existingMarker.infoWindow) {
              existingMarker.infoWindow.open(map, existingMarker.marker);
            }
            return;
          }

          const buddyMarker = new (window as any).google.maps.Marker({
            position,
            map,
            title: `${buddy.nickname} - ${buddy.name || "Unknown"}`,
            icon: getBuddyMarkerIcon(buddy.id, 40),
            animation: (window as any).google.maps.Animation.DROP,
          });

          // Create info window for the temporary marker
          const infoWindow = new (window as any).google.maps.InfoWindow({
            content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              ${buddy.nickname}
            </h3>
            ${buddy.name ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${buddy.name}</p>` : ""}
            ${buddy.phoneNumber ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">📞 ${buddy.phoneNumber}</p>` : ""}
            ${buddy.lastSeen ? `<p style="margin: 0; color: #9ca3af; font-size: 12px;">Last seen: ${new Date(buddy.lastSeen).toLocaleDateString()}</p>` : ""}
          </div>
        `,
          });

          // Add click listener to show info window
          buddyMarker.addListener("click", () => {
            // Close any open info windows
            buddyMarkersRef.current.forEach(markerData => {
              if (markerData.infoWindow) {
                markerData.infoWindow.close();
              }
            });

            infoWindow.open(map, buddyMarker);
          });

          // Track this temporary marker
          buddyMarkersRef.current.push({
            marker: buddyMarker,
            infoWindow: infoWindow,
            buddy: buddy,
            isTemporary: true,
          });

          console.log("Created temporary marker for:", buddy.nickname);
        }, 50); // Small delay to prevent race conditions
      } else {
        // If already showing buddies, just focus on the existing marker
        const existingMarker = buddyMarkersRef.current.find(
          markerData => markerData.buddy?.id === buddy.id
        );
        if (existingMarker) {
          // Close any open info windows
          buddyMarkersRef.current.forEach(markerData => {
            if (markerData.infoWindow) {
              markerData.infoWindow.close();
            }
          });

          // Open this buddy's info window
          if (existingMarker.infoWindow) {
            existingMarker.infoWindow.open(map, existingMarker.marker);
          }

          // Add a brief bounce animation to highlight the marker
          existingMarker.marker.setAnimation(
            (window as any).google.maps.Animation.BOUNCE
          );
          setTimeout(() => {
            existingMarker.marker.setAnimation(null);
          }, 1500);
        }
      }

      console.log("Selected buddy:", buddy.nickname, "at", position);
    }
  };

  const handleLocationSelect = (result: SearchResult) => {
    if (map) {
      // Use the lat/lng directly from the search result
      const position = { lat: result.lat, lng: result.lng };
      map.setCenter(position);
      map.setZoom(15);
      console.log("Location selected and map centered:", result);
    }
  };

  if (!isClient) {
    return <MapLoadingState />;
  }

  return (
    <div className="relative h-[calc(100svh-64px)] w-full bg-gray-100 sm:mt-8 sm:h-[calc(100svh-128px)] sm:rounded-sm">
      {/* Search Bar */}
      <div className="absolute top-4 right-4 left-4 z-10">
        <MapSearch
          map={map}
          onLocationSelect={handleLocationSelect}
          onBuddySelect={handleBuddySelect}
        />
      </div>

      {/* Floating Action Button */}
      <MapFab
        onAddAlert={handleAddAlertPin}
        onFindBuddies={handleFindBuddies}
        onFindRoute={handleFindRoute}
        isPlacementMode={isPlacementMode}
        isRouteMode={isRouteMode}
      />

      {/* Status Indicator */}
      <MapStatusIndicator alertStatus={alertStatus} routeStatus={routeStatus} />

      {/* Alert Modal */}
      <AlertModal
        selectedAlert={selectedAlert}
        isModalOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={showIncidentModal}
        onClose={closeIncidentModal}
        selectedLocation={selectedLocation || undefined}
        onAlertSubmitted={loadAlerts}
      />

      {/* Map */}
      <div
        ref={mapRef}
        className="h-full w-full border-2 sm:rounded-lg sm:border sm:shadow-md"
      />
    </div>
  );
}
