"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SearchResult {
  placeId: string;
  description: string;
  lat: number;
  lng: number;
}

interface UseLocationSearchProps {
  map?: google.maps.Map;
  onLocationSelect?: (result: SearchResult) => void;
}

// Extend window interface for Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

export function useLocationSearch({
  map,
  onLocationSelect,
}: UseLocationSearchProps = {}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Refs for cleanup and debouncing
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize Google Places services when map is ready
  useEffect(() => {
    if (map && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(map);
    }
  }, [map]);

  // Debounced search function to minimize API calls
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        if (searchQuery.trim().length < 2) {
          setSuggestions([]);
          setIsOpen(false);
          return;
        }

        if (!autocompleteService.current) return;

        setIsLoading(true);

        // Use AutocompleteService for suggestions (more quota-efficient than full search)
        autocompleteService.current.getPlacePredictions(
          {
            input: searchQuery,
            // Bias results to current map bounds if available
            bounds: map?.getBounds() || undefined,
            // Restrict to establishments and geocodes for better results
            types: ["establishment", "geocode"],
            // Limit results to reduce quota usage
            componentRestrictions: { country: "ca" }, // Assuming Canadian campus
          },
          (
            predictions: google.maps.places.AutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            setIsLoading(false);

            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              // Convert predictions to our SearchResult format
              const results: SearchResult[] = predictions
                .slice(0, 5)
                .map(prediction => ({
                  placeId: prediction.place_id,
                  description: prediction.description,
                  lat: 0, // Will be filled when selected
                  lng: 0, // Will be filled when selected
                }));

              setSuggestions(results);
              setIsOpen(true);
            } else {
              setSuggestions([]);
              setIsOpen(false);
            }
          }
        );
      }, 300); // 300ms debounce to prevent excessive API calls
    },
    [map]
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    (suggestion: SearchResult) => {
      if (!placesService.current) return;

      setIsLoading(true);
      setIsOpen(false);
      setQuery(suggestion.description);

      // Get detailed place information including coordinates
      placesService.current.getDetails(
        {
          placeId: suggestion.placeId,
          fields: ["geometry", "name", "formatted_address"],
        },
        (
          place: google.maps.places.PlaceResult | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          setIsLoading(false);

          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            const result: SearchResult = {
              ...suggestion,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            // Update map view
            if (map) {
              map.setCenter({ lat: result.lat, lng: result.lng });
              map.setZoom(16); // Zoom in to show the location clearly
            }

            onLocationSelect?.(result);
          }
        }
      );
    },
    [map, onLocationSelect]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  // Close suggestions
  const closeSuggestions = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    query,
    suggestions,
    isLoading,
    isOpen,
    handleSearchChange,
    handleSuggestionSelect,
    clearSearch,
    closeSuggestions,
  };
}
