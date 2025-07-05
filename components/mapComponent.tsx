"use client";

import {
  Search,
  MessageCircleHeart,
  Users,
  Navigation,
  MapPin,
  Clock,
  User,
} from "lucide-react";
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

export default function MapComponent({ userId }: { userId: string }) {
  const { updateLocation } = useLocation();

  const { mapRef, map, isClient } = useGoogleMaps({
    onLocationUpdate: updateLocation,
  });

  const { users } = useUserMarkers({ map, isClient });

  const { alerts, loadAlerts } = useAlertMarkers({
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
            className="w-full bg-white pr-10 pl-10 shadow-md"
          />
          {(query || isSearchLoading) && (
            <button
              onClick={clearSearch}
              className="absolute top-1/2 right-3 z-10 h-5 w-5 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
            >
              {isSearchLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
              ) : (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Search Suggestions Dropdown */}
          {isSuggestionsOpen && suggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
              {suggestions.map(suggestion => (
                <button
                  key={suggestion.placeId}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-muted focus:bg-muted focus:outline-none"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {suggestion.description.split(",")[0]}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
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

      {/* Action Buttons */}
      <div className="absolute top-20 right-4 left-4 z-10">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleAddAlertPin}
            className="flex flex-col items-center space-y-1 rounded-lg bg-white p-3 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500">
              <MessageCircleHeart className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-gray-600">Add Alert</span>
          </button>
          <button className="flex flex-col items-center space-y-1 rounded-lg bg-white p-3 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-gray-600">Find Buddies</span>
          </button>
          <button className="flex flex-col items-center space-y-1 rounded-lg bg-white p-3 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
              <Navigation className="h-4 w-4 text-white" />
            </div>
            <span className="text-xs text-gray-600">Find Route</span>
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      {alertStatus.type && (
        <div className="absolute top-40 right-4 left-4 z-20">
          <div
            className={`mx-auto max-w-sm rounded-lg p-3 shadow-lg transition-all duration-300 ${
              alertStatus.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              {alertStatus.type === "success" ? (
                <svg
                  className="h-5 w-5"
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
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
              <span className="text-sm font-medium">{alertStatus.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              View information about this safety alert including location and
              timestamp.
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4">
              {/* Timestamp */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Clock className="mt-0.5 h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Timestamp
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAlert.createdAt.toLocaleDateString()} at{" "}
                    {selectedAlert.createdAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <MapPin className="mt-0.5 h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Location
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAlert.address || "Address not available"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedAlert.lat.toFixed(6)},{" "}
                    {selectedAlert.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              {/* User */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <User className="mt-0.5 h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Initiated by
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAlert.userName || "Unknown User"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ID: {selectedAlert.userId}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => closeModal()}>
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
