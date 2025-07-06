"use client";

import {
  useGoogleMaps,
  useUserMarkers,
  useAlertMarkers,
  useAlerts,
  useAlertModal,
  useLocation,
} from "./map/hooks";
import {
  MapFab,
  MapSearch,
  MapStatusIndicator,
  AlertModal,
  MapLoadingState,
} from "./map";

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

  const { alertStatus, isPlacementMode, addAlertPin } = useAlerts();

  const { selectedAlert, isModalOpen, openModal, closeModal } = useAlertModal();

  const handleAddAlertPin = () => {
    if (map) {
      addAlertPin(map, () => {
        loadAlerts();
      });
    }
  };

  const handleFindBuddies = () => {
    // TODO: Implement find buddies functionality
    console.log("Find buddies clicked");
  };

  const handleFindRoute = () => {
    // TODO: Implement find route functionality
    console.log("Find route clicked");
  };

  if (!isClient) {
    return <MapLoadingState />;
  }

  return (
    <div className="relative h-[calc(100svh-64px)] w-full bg-gray-100">
      {/* Search Bar */}
      <div className="absolute top-4 right-4 left-4 z-10">
        <MapSearch
          map={map}
          onLocationSelect={result => {
            console.log("Location selected:", result);
          }}
        />
      </div>

      {/* Floating Action Button */}
      <MapFab
        onAddAlert={handleAddAlertPin}
        onFindBuddies={handleFindBuddies}
        onFindRoute={handleFindRoute}
        isPlacementMode={isPlacementMode}
      />

      {/* Status Indicator */}
      <MapStatusIndicator alertStatus={alertStatus} />

      {/* Alert Modal */}
      <AlertModal
        selectedAlert={selectedAlert}
        isModalOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Map */}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
