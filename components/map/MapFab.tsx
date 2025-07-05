"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, MessageCircleHeart, Users, Navigation } from "lucide-react";

interface MapFabProps {
  onAddAlert: () => void;
  onFindBuddies: () => void;
  onFindRoute: () => void;
}

export default function MapFab({
  onAddAlert,
  onFindBuddies,
  onFindRoute,
}: MapFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close FAB
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddAlert = () => {
    onAddAlert();
    setIsOpen(false);
  };

  const handleFindBuddies = () => {
    onFindBuddies();
    setIsOpen(false);
  };

  const handleFindRoute = () => {
    onFindRoute();
    setIsOpen(false);
  };

  return (
    <div className="absolute bottom-6 left-4 z-20" ref={fabRef}>
      {/* FAB Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 mb-2 min-w-48 overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
          <button
            onClick={handleAddAlert}
            className="flex w-full items-center space-x-3 border-b border-gray-100 px-4 py-4 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 shadow-sm">
              <MessageCircleHeart className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Add Alert
              </span>
              <p className="text-xs text-gray-500">Report safety concern</p>
            </div>
          </button>

          <button
            onClick={handleFindBuddies}
            className="flex w-full items-center space-x-3 border-b border-gray-100 px-4 py-4 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Find Buddies
              </span>
              <p className="text-xs text-gray-500">
                Connect with nearby friends
              </p>
            </div>
          </button>

          <button
            onClick={handleFindRoute}
            className="flex w-full items-center space-x-3 px-4 py-4 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Find Route
              </span>
              <p className="text-xs text-gray-500">Get safe directions</p>
            </div>
          </button>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
          isOpen
            ? "rotate-45 bg-gradient-to-r from-gray-600 to-gray-700"
            : "bg-gradient-to-r from-primary to-purple-600 hover:scale-105 hover:shadow-xl"
        }`}
      >
        <Plus className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
