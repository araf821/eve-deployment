"use client";

import { useEffect, useRef, useState } from "react";

interface UseGoogleMapsProps {
  onMapReady?: (map: any) => void;
  onLocationUpdate?: (lat: number, lng: number) => void;
}

export function useGoogleMaps({
  onMapReady,
  onLocationUpdate,
}: UseGoogleMapsProps = {}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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
      onMapReady?.(mapInstance);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapInstance.setCenter(userPos);
          mapInstance.setZoom(12);
          onLocationUpdate?.(userPos.lat, userPos.lng);

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  }, [isClient]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    mapRef,
    map,
    isClient,
  };
}
