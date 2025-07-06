"use client";

import { X } from "lucide-react";

interface AlertStatus {
  type: "success" | "error" | "info" | null;
  message: string;
}

interface MapStatusIndicatorProps {
  alertStatus: AlertStatus;
  routeStatus?: string;
}

export default function MapStatusIndicator({
  alertStatus,
  routeStatus,
}: MapStatusIndicatorProps) {
  // Show route status if available, otherwise show alert status
  const shouldShowRouteStatus = routeStatus && routeStatus.length > 0;
  const shouldShowAlertStatus = alertStatus.type && alertStatus.message;

  if (!shouldShowRouteStatus && !shouldShowAlertStatus) {
    return null;
  }

  return (
    <div className="absolute top-20 right-4 left-4 z-20">
      {shouldShowRouteStatus && (
        <div className="mx-auto mb-2 max-w-sm rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                ></path>
              </svg>
            </div>
            <span className="text-sm font-medium">{routeStatus}</span>
          </div>
        </div>
      )}

      {shouldShowAlertStatus && (
        <div
          className={`mx-auto max-w-sm rounded-xl p-4 shadow-lg transition-all duration-300 ${
            alertStatus.type === "success"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : alertStatus.type === "info"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white"
          }`}
        >
          <div className="flex items-center space-x-3">
            {alertStatus.type === "success" ? (
              <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
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
            ) : alertStatus.type === "info" ? (
              <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            ) : (
              <div className="flex size-6 items-center justify-center rounded-full bg-white/20">
                <X className="h-4 w-4" />
              </div>
            )}
            <span className="text-sm font-medium">{alertStatus.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
