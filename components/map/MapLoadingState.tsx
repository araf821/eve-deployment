"use client";

import { Loader2 } from "lucide-react";

interface MapLoadingStateProps {
  message?: string;
}

export default function MapLoadingState({
  message = "Loading map...",
}: MapLoadingStateProps) {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="text-sm font-medium text-gray-600">{message}</div>
      </div>
    </div>
  );
}
