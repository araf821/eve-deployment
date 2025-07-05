"use client";

import { X } from "lucide-react";

interface AlertStatus {
  type: "success" | "error" | null;
  message: string;
}

interface MapStatusIndicatorProps {
  alertStatus: AlertStatus;
}

export default function MapStatusIndicator({
  alertStatus,
}: MapStatusIndicatorProps) {
  if (!alertStatus.type) {
    return null;
  }

  return (
    <div className="absolute top-20 right-4 left-4 z-20">
      <div
        className={`mx-auto max-w-sm rounded-xl p-4 shadow-lg transition-all duration-300 ${
          alertStatus.type === "success"
            ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
            : "bg-gradient-to-r from-red-500 to-red-600 text-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          {alertStatus.type === "success" ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <svg
                className="h-4 w-4"
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
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <X className="h-4 w-4" />
            </div>
          )}
          <span className="text-sm font-medium">{alertStatus.message}</span>
        </div>
      </div>
    </div>
  );
}
