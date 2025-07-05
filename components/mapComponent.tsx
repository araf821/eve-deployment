"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MessageCircleHeart, Users, Navigation, MoreHorizontal } from "lucide-react";

export default function MapComponent({ userId }: { userId: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateLocation = async (lat: number, lng: number) => {
    try {
      await fetch('/api/location', {
        method: 'POST',
        body: JSON.stringify({ lat, lng }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const loadUsers = async () => {
    console.log("Loading users...");
    try {
      const res = await fetch('/api/users');
      const usersData = await res.json();
      console.log("Users loaded:", usersData);
      setUsers(usersData);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const createUserMarkers = () => {
    if (!map || !isClient) {
      console.log("Cannot create markers - map:", !!map, "isClient:", isClient);
      return;
    }

    if (typeof window === 'undefined' || !window.google) {
      console.log("Google Maps not available");
      return;
    }

    // Clear existing markers
    clearMarkers();

    console.log("Creating markers for users:", users.length);

    users.forEach((user, index) => {
      console.log(`Creating marker ${index + 1}:`, user.name, user.lat, user.lng);
      
      if (user.lat && user.lng) {
        try {
          const position = { lat: parseFloat(user.lat), lng: parseFloat(user.lng) };
          console.log("Parsed position:", position);
          
          // Use default marker first to test
          const marker = new google.maps.Marker({
            position,
            map,
            title: user.name,
            // Remove custom icon temporarily to test with default red marker
            // icon: {
            //   url:
            //     "data:image/svg+xml;charset=UTF-8," +
            //     encodeURIComponent(`
            //       <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            //         <circle cx="10" cy="10" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
            //         <circle cx="10" cy="10" r="3" fill="white"/>
            //       </svg>
            //     `),
            //   scaledSize: new google.maps.Size(20, 20),
            // },
          });
          
          // Add click listener to test if marker exists
          marker.addListener('click', () => {
            console.log(`Clicked marker for ${user.name}`);
            alert(`Clicked marker for ${user.name}`);
          });
          
          markersRef.current.push(marker);
          console.log(`Marker created successfully for ${user.name} at`, position);
          
          // Force marker to be visible
          marker.setVisible(true);
          console.log("Marker visibility set to true");
          
        } catch (error) {
          console.error(`Error creating marker for ${user.name}:`, error);
        }
      } else {
        console.log(`Skipping marker for ${user.name} - missing coordinates`);
      }
    });
    
    console.log("Total markers created:", markersRef.current.length);
    
    // Keep map centered on current user's location with a fixed zoom level
    // The map will stay centered on the user's location but show other markers too
  };

  useEffect(() => {
    if (!isClient) return;

    const initMap = () => {
      if (!mapRef.current || typeof window === 'undefined') return;

      const defaultLocation = { lat: 43.6532, lng: -79.3832 };
      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 12, // Fixed zoom level - zoomed out enough to see surrounding area
        center: defaultLocation,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      setMap(mapInstance);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.setCenter(userPos);
          mapInstance.setZoom(12); // Keep consistent zoom level
          updateLocation(userPos.lat, userPos.lng);

          const userMarker = new google.maps.Marker({
            position: userPos,
            map: mapInstance,
            title: "Your Location",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="white"/>
                  </svg>
                `),
              scaledSize: new google.maps.Size(20, 20),
            },
          });
        });
      }
    };

    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [isClient]);

  // Load users when map is ready
  useEffect(() => {
    console.log("Map ready effect - map:", !!map, "isClient:", isClient);
    if (map && isClient) {
      loadUsers();
    }
  }, [map, isClient]);

  // Create markers when users data changes
  useEffect(() => {
    console.log("Users effect - users:", users.length, "map:", !!map, "isClient:", isClient);
    if (users.length > 0 && map && isClient) {
      // Add a small delay to ensure map is fully rendered
      setTimeout(() => {
        createUserMarkers();
      }, 100);
    }
  }, [users, map, isClient]);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, []);

  if (!isClient) {
    return (
      <div className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Filter a location"
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-md border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons - Moved above map */}
      <div className="absolute top-20 left-4 right-4 z-10">
        <div className="flex items-center justify-center space-x-4">
          <button className="flex flex-col items-center space-y-1 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <MessageCircleHeart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600">
              Add Alert
              </span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600">Find Buddies</span>
          </button>
          <button className="flex flex-col items-center space-y-1 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs text-gray-600">Find Route</span>
          </button>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}