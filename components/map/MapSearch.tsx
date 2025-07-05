"use client";

import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocationSearch } from "./hooks";
import { useEffect, useRef } from "react";

interface SearchResult {
  placeId: string;
  description: string;
  lat: number;
  lng: number;
}

interface MapSearchProps {
  map?: google.maps.Map;
  onLocationSelect?: (result: SearchResult) => void;
}

export default function MapSearch({ map, onLocationSelect }: MapSearchProps) {
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

  return (
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
  );
}
