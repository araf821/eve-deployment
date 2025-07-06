"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface InstantAlertButtonProps {
  className?: string;
}

export function InstantAlertButton({ className }: InstantAlertButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInstantAlert = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current location
      let position: GeolocationPosition | null = null;
      
      try {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
          }
          
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        });

        // Also update the location in the database immediately
        if (position) {
          try {
            await fetch("/api/location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }),
            });
            console.log("Location updated in database");
          } catch (locationError) {
            console.warn("Failed to update location in database:", locationError);
          }
        }
      } catch (geoError) {
        console.warn("Could not get current location:", geoError);
        // Continue without location - the API will use last known location
      }

      // Prepare request body
      const requestBody: any = {};
      
      if (position) {
        requestBody.lat = position.coords.latitude;
        requestBody.lng = position.coords.longitude;
        console.log("Using current location:", { lat: position.coords.latitude, lng: position.coords.longitude });
      } else {
        console.log("No current location available, will use last known location from database");
      }

      // Send instant alert
      const response = await fetch("/api/alerts/instant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to send alert");
      }

      const result = await response.json();
      
      console.log("Instant alert result:", result);
      
      // Show success message
      setShowSuccess(true);
      
      // If there's a warning about SMS, show it
      if (result.warning) {
        console.warn("SMS Warning:", result.warning);
        // You could show this warning to the user if needed
      }
      
      // Redirect to dashboard with success parameter after 2 seconds
      setTimeout(() => {
        router.push("/dashboard?success=true");
      }, 2000);

    } catch (err) {
      console.error("Error sending instant alert:", err);
      setError(err instanceof Error ? err.message : "Failed to send alert");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className={`w-full rounded-lg bg-green-500/50 p-1.5 ${className}`}>
        <div className="flex h-16 items-center justify-center rounded-lg bg-green-500 p-4 text-lg font-semibold text-white">
          <CheckCircle className="mr-2 h-5 w-5" />
          Alert Sent Successfully!
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <button
        onClick={handleInstantAlert}
        disabled={isLoading}
        className="w-full rounded-lg bg-[#FF6767]/50 p-1.5 disabled:opacity-50"
      >
        <div className="flex h-16 items-center justify-center rounded-lg bg-[#FF6767] p-4 text-lg font-semibold text-red-50">
          {isLoading ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending Alert...
            </>
          ) : (
            <>
              <AlertTriangle className="mr-2 h-5 w-5" />
              Send Emergency Alert
            </>
          )}
        </div>
      </button>
      
      {error && (
        <div className="mt-2 flex items-center rounded-md bg-red-50 p-2 text-sm text-red-600">
          <X className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
} 