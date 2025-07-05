"use client";

import { useEffect, useState } from "react";

export default function CurrentLocation() {
  const [location, setLocation] = useState<string>("Getting location...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude } = position.coords;

            // Use reverse geocoding to get address
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );

            if (response.ok) {
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                // Get the formatted address
                const address = data.results[0].formatted_address;
                setLocation(address);
              } else {
                setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
            } else {
              setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } catch (error) {
            console.error("Error getting location name:", error);
            setLocation("Location unavailable");
          }
        },
        error => {
          console.error("Error getting location:", error);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Location not supported");
    }
  }, []);

  return (
    <div className="mb-3 text-xs text-gray-800 italic">
      Your Location: {location}
    </div>
  );
}
