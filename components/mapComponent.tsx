"use client";

import { Clock, User, X, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useGoogleMaps,
  useUserMarkers,
  useAlertMarkers,
  useAlerts,
  useAlertModal,
  useLocation,
} from "./map/hooks";
import MapFab from "./map/MapFab";
import MapSearch from "./map/MapSearch";

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

  const { alertStatus, addAlertPin } = useAlerts();

  const { selectedAlert, isModalOpen, openModal, closeModal } = useAlertModal();

  const handleAddAlertPin = () => {
    addAlertPin(() => {
      loadAlerts();
    });
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
    return (
      <div className="relative flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-gray-100">
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
      />

      {/* Status Indicator */}
      {alertStatus.type && (
        <div className="absolute top-20 right-4 left-4 z-20">
          <div
            className={`mx-auto max-w-sm rounded-xl p-4 shadow-lg transition-all duration-300 ${
              alertStatus.type === "success"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              {alertStatus.type === "success" ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <X className="h-4 w-4" />
                </div>
              )}
              <span className="text-sm font-medium">{alertStatus.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md rounded-2xl border-0 shadow-xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Alert Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              View information about this safety alert including location and
              timestamp.
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-6 py-2">
              {/* Timestamp */}
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    Timestamp
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAlert.createdAt.toLocaleDateString()} at{" "}
                    {selectedAlert.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    Location
                  </h3>
                  <p className="mb-1 text-sm text-gray-600">
                    {selectedAlert.address || "Address not available"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedAlert.lat.toFixed(6)},{" "}
                    {selectedAlert.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              {/* User */}
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    Initiated by
                  </h3>
                  <p className="mb-1 text-sm text-gray-600">
                    {selectedAlert.userName || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {selectedAlert.userId}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => closeModal()}
              className="h-12 w-full rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Map */}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
