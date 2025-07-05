"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  MessageCircleHeart,
  Users,
  Navigation,
  X,
  MapPin,
  Clock,
  User,
} from "lucide-react";

interface AlertData {
  id: string;
  userId: string;
  lat: number;
  lng: number;
  address?: string;
  createdAt: Date;
  userName?: string;
  marker?: any;
}

export default function MapComponent({ userId }: { userId: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const alertMarkersRef = useRef<any[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateLocation = async (lat: number, lng: number) => {
    try {
      await fetch("/api/location", {
        method: "POST",
        body: JSON.stringify({ lat, lng }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    alertMarkersRef.current.forEach(marker => marker.setMap(null));
    alertMarkersRef.current = [];
  };

  const loadUsers = async () => {
    console.log("Loading users...");
    try {
      const res = await fetch("/api/users");
      const usersData = await res.json();
      console.log("Users loaded:", usersData);
      setUsers(usersData);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const loadAlerts = async () => {
    console.log("Loading alerts...");
    try {
      const res = await fetch("/api/alerts");
      const alertsData = await res.json();
      console.log("Alerts loaded:", alertsData);

      const formattedAlerts = alertsData.map((alert: any) => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
      }));

      setAlerts(formattedAlerts);
    } catch (err) {
      console.error("Error loading alerts:", err);
    }
  };

  const createUserMarkers = () => {
    if (!map || !isClient) {
      console.log("Cannot create markers - map:", !!map, "isClient:", isClient);
      return;
    }

    if (typeof window === "undefined" || !window.google) {
      console.log("Google Maps not available");
      return;
    }

    // Clear existing user markers only
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    console.log("Creating markers for users:", users.length);

    users.forEach((user, index) => {
      console.log(
        `Creating marker ${index + 1}:`,
        user.name,
        user.lat,
        user.lng
      );

      if (user.lat && user.lng) {
        try {
          const position = {
            lat: Number.parseFloat(user.lat),
            lng: Number.parseFloat(user.lng),
          };
          console.log("Parsed position:", position);

          const marker = new (window as any).google.maps.Marker({
            position,
            map,
            title: user.name,
          });

          marker.addListener("click", () => {
            console.log(`Clicked marker for ${user.name}`);
            alert(`Clicked marker for ${user.name}`);
          });

          markersRef.current.push(marker);
          console.log(
            `Marker created successfully for ${user.name} at`,
            position
          );

          marker.setVisible(true);
          console.log("Marker visibility set to true");
        } catch (error) {
          console.error(`Error creating marker for ${user.name}:`, error);
        }
      } else {
        console.log(`Skipping marker for ${user.name} - missing coordinates`);
      }
    });

    console.log("Total user markers created:", markersRef.current.length);
  };

  const createAlertMarkers = () => {
    if (!map || !isClient || !window.google) {
      return;
    }

    // Clear existing alert markers
    alertMarkersRef.current.forEach(marker => marker.setMap(null));
    alertMarkersRef.current = [];

    console.log("Creating alert markers:", alerts.length);

    alerts.forEach(alert => {
      const position = { lat: alert.lat, lng: alert.lng };

      const alertMarker = new (window as any).google.maps.Marker({
        position,
        map,
        title: `Alert by ${alert.userName || "Unknown User"}`,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new (window as any).google.maps.Size(32, 32),
        },
      });

      // Add click listener to show modal
      alertMarker.addListener("click", () => {
        setSelectedAlert(alert);
        setIsModalOpen(true);
      });

      // Store marker reference in alert data
      alert.marker = alertMarker;
      alertMarkersRef.current.push(alertMarker);
    });

    console.log("Total alert markers created:", alertMarkersRef.current.length);
  };

  const formatAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              resolve(results[0].formatted_address);
            } else {
              reject("Geocoding failed");
            }
          }
        );
      });
      return response as string;
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const addAlertPin = () => {
    if (!map || !navigator.geolocation) {
      setAlertStatus({ type: "error", message: "Geolocation not available" });
      setTimeout(() => setAlertStatus({ type: null, message: "" }), 3000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("Adding alert pin at position:", userPos);

        try {
          // Get formatted address
          const address = await formatAddress(userPos.lat, userPos.lng);

          // Save to database
          const response = await fetch("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: userPos.lat,
              lng: userPos.lng,
              address,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save alert");
          }

          const savedAlert = await response.json();

          // Reload alerts to get the updated list
          await loadAlerts();

          // Show success message
          setAlertStatus({
            type: "success",
            message: "Alert pin added successfully!",
          });
          setTimeout(() => setAlertStatus({ type: null, message: "" }), 3000);
        } catch (error) {
          console.error("Error saving alert:", error);
          setAlertStatus({ type: "error", message: "Failed to save alert" });
          setTimeout(() => setAlertStatus({ type: null, message: "" }), 3000);
        }
      },
      error => {
        console.error("Geolocation error:", error);
        setAlertStatus({
          type: "error",
          message: "Failed to get your location",
        });
        setTimeout(() => setAlertStatus({ type: null, message: "" }), 3000);
      }
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  useEffect(() => {
    if (!isClient) return;

    const initMap = () => {
      if (!mapRef.current || typeof window === "undefined") return;

      const defaultLocation = { lat: 43.6532, lng: -79.3832 };
      const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 12,
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
          position: (window as any).google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      setMap(mapInstance);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.setCenter(userPos);
          mapInstance.setZoom(12);
          updateLocation(userPos.lat, userPos.lng);

          const userMarker = new (window as any).google.maps.Marker({
            position: userPos,
            map: mapInstance,
            title: "Your Location",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="#3B82F6" stroke="white" strokeWidth="2"/>
                    <circle cx="10" cy="10" r="3" fill="white"/>
                  </svg>
                `),
              scaledSize: new (window as any).google.maps.Size(20, 20),
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

  useEffect(() => {
    console.log("Map ready effect - map:", !!map, "isClient:", isClient);
    if (map && isClient) {
      loadUsers();
      loadAlerts();
    }
  }, [map, isClient]);

  useEffect(() => {
    console.log(
      "Users effect - users:",
      users.length,
      "map:",
      !!map,
      "isClient:",
      isClient
    );
    if (users.length > 0 && map && isClient) {
      setTimeout(() => {
        createUserMarkers();
      }, 100);
    }
  }, [users, map, isClient]);

  useEffect(() => {
    console.log(
      "Alerts effect - alerts:",
      alerts.length,
      "map:",
      !!map,
      "isClient:",
      isClient
    );
    if (alerts.length > 0 && map && isClient) {
      setTimeout(() => {
        createAlertMarkers();
      }, 100);
    }
  }, [alerts, map, isClient]);

  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, []);

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
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Filter a location"
            className="w-full rounded-lg border-0 bg-white py-3 pr-4 pl-10 text-gray-700 placeholder-gray-400 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-20 right-4 left-4 z-10">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={addAlertPin}
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
      {isModalOpen && selectedAlert && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Alert Details
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 p-4">
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

            {/* Modal Footer */}
            <div className="flex justify-end border-t p-4">
              <button
                onClick={closeModal}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
