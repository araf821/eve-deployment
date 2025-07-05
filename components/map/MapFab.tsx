"use client";

import { Plus, MessageCircleHeart, Users, Navigation } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  return (
    <div className="absolute bottom-6 left-4 z-20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex size-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:outline-none data-[state=open]:rotate-45 data-[state=open]:bg-gradient-to-r data-[state=open]:from-gray-600 data-[state=open]:to-gray-700">
            <Plus className="size-6 text-white" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          className="mb-2 min-w-48 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl"
          sideOffset={8}
        >
          <DropdownMenuItem
            onClick={onAddAlert}
            className="flex cursor-pointer items-center space-x-3 px-4 py-4 text-left transition-colors focus:bg-gray-50"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-600 shadow-sm">
              <MessageCircleHeart className="size-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Add Alert
              </span>
              <p className="text-xs text-gray-500">Report safety concern</p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onFindBuddies}
            className="flex cursor-pointer items-center space-x-3 border-b border-gray-100 px-4 py-4 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
              <Users className="size-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Find Buddies
              </span>
              <p className="text-xs text-gray-500">
                Connect with nearby friends
              </p>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onFindRoute}
            className="flex cursor-pointer items-center space-x-3 px-4 py-4 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
              <Navigation className="size-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Find Route
              </span>
              <p className="text-xs text-gray-500">Get safe directions</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
