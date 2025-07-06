"use client";

import { Search, MapPin, X, User, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocationSearch } from "./hooks";
import { useBuddies } from "./hooks/useBuddies";
import { getBuddyUIColor } from "@/components/map/hooks/buddyColors";
import { useEffect, useRef, useState } from "react";
import type { google } from "google-maps";

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

interface MapSearchProps {
  map?: google.maps.Map;
  onLocationSelect?: (result: SearchResult) => void;
  onBuddySelect?: (buddy: Buddy) => void;
}

export default function MapSearch({
  map,
  onLocationSelect,
  onBuddySelect,
}: MapSearchProps) {
  const [activeTab, setActiveTab] = useState<"all" | "buddies" | "locations">(
    "all"
  );

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
      onLocationSelect?.(result);
    },
  });

  const { buddies, loading: buddiesLoading } = useBuddies();

  // Filter buddies based on search query - ensure buddies is always an array
  const filteredBuddies = Array.isArray(buddies)
    ? buddies.filter(
        buddy =>
          buddy.nickname.toLowerCase().includes(query.toLowerCase()) ||
          (buddy.name && buddy.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

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

  const handleBuddyClick = (buddy: Buddy) => {
    // Clear search input and close dropdown
    clearSearch();
    closeSuggestions();

    // Let the parent component handle all marker creation and map operations
    onBuddySelect?.(buddy);
  };

  const showDropdown =
    isSuggestionsOpen &&
    (query.length > 0 || (Array.isArray(buddies) && buddies.length > 0));
  const showBuddies = activeTab === "all" || activeTab === "buddies";
  const showLocations = activeTab === "all" || activeTab === "locations";

  return (
    <div className="relative" ref={searchContainerRef}>
      <Search className="absolute top-1/2 left-3 z-10 size-5 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search buddies or locations..."
        value={query}
        onChange={e => handleSearchChange(e.target.value)}
        onFocus={() => {
          // Show dropdown when focused, even without query for buddies
          if (buddies.length > 0) {
            // This will be handled by the existing logic
          }
        }}
        className="h-12 w-full rounded-xl border-0 bg-white pr-10 pl-10 text-base shadow-lg placeholder:text-gray-500"
      />
      {(query || isSearchLoading) && (
        <button
          onClick={clearSearch}
          className="absolute top-1/2 right-3 z-10 flex size-6 -translate-y-1/2 transform items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
        >
          {isSearchLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-80 overflow-hidden rounded-xl border-0 bg-white shadow-xl">
          {/* Tab Navigation */}
          {(filteredBuddies.length > 0 || suggestions.length > 0) && (
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
              {Array.isArray(buddies) && filteredBuddies.length > 0 && (
                <button
                  onClick={() => setActiveTab("buddies")}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "buddies"
                      ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Buddies ({filteredBuddies.length})
                </button>
              )}
              {suggestions.length > 0 && (
                <button
                  onClick={() => setActiveTab("locations")}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "locations"
                      ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Locations ({suggestions.length})
                </button>
              )}
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {/* Buddies Section */}
            {showBuddies && filteredBuddies.length > 0 && (
              <div>
                {activeTab === "all" && (
                  <div className="bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Your Buddies
                  </div>
                )}
                {filteredBuddies.map(buddy => {
                  const buddyColor = getBuddyUIColor(buddy.id);
                  return (
                    <button
                      key={buddy.id}
                      onClick={() => handleBuddyClick(buddy)}
                      className="w-full border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `${buddyColor}20`,
                              border: `2px solid ${buddyColor}`,
                            }}
                          >
                            <User
                              className="h-4 w-4"
                              style={{ color: buddyColor }}
                            />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {buddy.nickname}
                          </p>
                          {buddy.name && (
                            <p className="truncate text-xs text-gray-500">
                              {buddy.name}
                            </p>
                          )}
                          <div className="mt-1 flex items-center space-x-2">
                            {buddy.lat && buddy.lng ? (
                              <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                <MapPin className="mr-1 h-3 w-3" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                No location
                              </span>
                            )}
                            {buddy.lastSeen && (
                              <span className="text-xs text-gray-400">
                                <Clock className="mr-1 inline h-3 w-3" />
                                {new Date(buddy.lastSeen).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Locations Section */}
            {showLocations && suggestions.length > 0 && (
              <div>
                {activeTab === "all" && filteredBuddies.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Locations
                  </div>
                )}
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion.placeId}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
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

            {/* Loading States */}
            {buddiesLoading && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                Loading buddies...
              </div>
            )}

            {isSearchLoading && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                Searching locations...
              </div>
            )}

            {/* No Results */}
            {query.length >= 2 &&
              filteredBuddies.length === 0 &&
              suggestions.length === 0 &&
              !isSearchLoading &&
              !buddiesLoading && (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No buddies or locations found for &quot;{query}&quot;
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
