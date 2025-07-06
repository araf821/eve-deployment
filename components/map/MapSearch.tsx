"use client"

import { Search, MapPin, X, User, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLocationSearch} from "./hooks"
import { useBuddies } from "./hooks/useBuddies"
import { useEffect, useRef, useState } from "react"

interface SearchResult {
  placeId: string
  description: string
  lat: number
  lng: number
}

interface Buddy {
  id: string
  nickname: string
  phoneNumber?: string
  lat?: string
  lng?: string
  name?: string
  lastSeen?: Date
}

interface MapSearchProps {
  map?: google.maps.Map
  onLocationSelect?: (result: SearchResult) => void
  onBuddySelect?: (buddy: Buddy) => void
}

export default function MapSearch({ map, onLocationSelect, onBuddySelect }: MapSearchProps) {
  const [activeTab, setActiveTab] = useState<"all" | "buddies" | "locations">("all")

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
    onLocationSelect: (result) => {
      console.log("Location selected:", result)
      onLocationSelect?.(result)
    },
  })

  const { buddies, loading: buddiesLoading } = useBuddies()

  // Filter buddies based on search query - ensure buddies is always an array
  const filteredBuddies = Array.isArray(buddies)
    ? buddies.filter(
        (buddy) =>
          buddy.nickname.toLowerCase().includes(query.toLowerCase()) ||
          (buddy.name && buddy.name.toLowerCase().includes(query.toLowerCase())),
      )
    : []

  // Ref for search container to handle click outside
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        closeSuggestions()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [closeSuggestions])

  const handleBuddyClick = (buddy: Buddy) => {
    if (map && buddy.lat && buddy.lng) {
      // Center map on buddy's location
      const position = { lat: Number.parseFloat(buddy.lat), lng: Number.parseFloat(buddy.lng) }
      map.setCenter(position)
      map.setZoom(15)

      // Create a temporary marker for the buddy
      const buddyMarker = new google.maps.Marker({
        position,
        map,
        title: `${buddy.nickname}'s Location`,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new google.maps.Size(32, 32),
        },
        animation: google.maps.Animation.BOUNCE,
      })

      // Remove the bounce animation after 2 seconds
      setTimeout(() => {
        if (buddyMarker) {
          buddyMarker.setAnimation(null)
        }
      }, 2000)

      // Update search input and close dropdown
      clearSearch()
      closeSuggestions()

      onBuddySelect?.(buddy)
    }
  }

  const showDropdown = isSuggestionsOpen && (query.length > 0 || (Array.isArray(buddies) && buddies.length > 0))
  const showBuddies = activeTab === "all" || activeTab === "buddies"
  const showLocations = activeTab === "all" || activeTab === "locations"

  return (
    <div className="relative" ref={searchContainerRef}>
      <Search className="absolute top-1/2 left-3 z-10 size-5 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search buddies or locations..."
        value={query}
        onChange={(e) => handleSearchChange(e.target.value)}
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
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
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
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
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
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
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
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    Your Buddies
                  </div>
                )}
                {filteredBuddies.map((buddy) => (
                  <button
                    key={buddy.id}
                    onClick={() => handleBuddyClick(buddy)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{buddy.nickname}</p>
                        {buddy.name && <p className="text-xs text-gray-500 truncate">{buddy.name}</p>}
                        <div className="flex items-center space-x-2 mt-1">
                          {buddy.lat && buddy.lng ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <MapPin className="w-3 h-3 mr-1" />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              No location
                            </span>
                          )}
                          {buddy.lastSeen && (
                            <span className="text-xs text-gray-400">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(buddy.lastSeen).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Locations Section */}
            {showLocations && suggestions.length > 0 && (
              <div>
                {activeTab === "all" && filteredBuddies.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-t border-gray-100">
                    Locations
                  </div>
                )}
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.placeId}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <MapPin className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {suggestion.description.split(",")[0]}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {suggestion.description.split(",").slice(1).join(",").trim()}
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
                <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                Loading buddies...
              </div>
            )}

            {isSearchLoading && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
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
                  No buddies or locations found for "{query}"
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  )
}
