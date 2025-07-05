"use client";

export function useLocation() {
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

  return {
    updateLocation,
  };
}
