"use client";

import { Search, MapPin, Clock, User, X } from "lucide-react";
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
  useLocationSearch,
} from "./map/hooks";
import { Input } from "./ui/input";
import { useEffect, useRef } from "react";
import MapFab from "./map/MapFab";

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

  const {
    query,
    suggestions,
    isLoading: isSearchLoading,
    isOpen: isSuggestionsOpen,
    handleSearchChange,
    handleSuggestionSelect,
    clearSearch,
    closeSuggestions,
  } = useLocationSearch({
    map,
    onLocationSelect: result => {
      console.log("Location selected:", result);
    },
  });

  // Ref for search container to handle click outside
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        closeSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeSuggestions]);

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
        <div className="relative" ref={searchContainerRef}>
          <Search className="absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a location"
            value={query}
            onChange={e => handleSearchChange(e.target.value)}
            className="h-12 w-full rounded-xl border-0 bg-white pr-10 pl-10 text-base shadow-lg placeholder:text-gray-500"
          />
          {(query || isSearchLoading) && (
            <button
              onClick={clearSearch}
              className="absolute top-1/2 right-3 z-10 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
            >
              {isSearchLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Search Suggestions Dropdown */}
          {isSuggestionsOpen && suggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border-0 bg-white shadow-xl">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion.placeId}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full border-b border-gray-100 px-4 py-4 text-left transition-colors first:rounded-t-xl last:rounded-b-xl last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {suggestion.description.split(",")[0]}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {suggestion.description
                          .split(",")
                          .slice(1)
                          .join(",")
                          .trim()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
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
