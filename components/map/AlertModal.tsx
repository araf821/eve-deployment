"use client";

import { Clock, User, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  createdAt: Date;
  userId: string;
  userName?: string;
}

interface AlertModalProps {
  selectedAlert: Alert | null;
  isModalOpen: boolean;
  onClose: () => void;
}

export default function AlertModal({
  selectedAlert,
  isModalOpen,
  onClose,
}: AlertModalProps) {
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl border-0 shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Alert Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            View information about this safety alert including location and
            timestamp.
          </DialogDescription>
        </DialogHeader>

        {selectedAlert && (
          <div className="space-y-6 py-2">
            {/* Timestamp */}
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  Timestamp
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedAlert.createdAt.toLocaleDateString()} at{" "}
                  {selectedAlert.createdAt.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <MapPin className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  Location
                </h3>
                <p className="mb-1 text-sm text-gray-600">
                  {selectedAlert.address || "Address not available"}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedAlert.lat.toFixed(6)}, {selectedAlert.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {/* User */}
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  Initiated by
                </h3>
                <p className="mb-1 text-sm text-gray-600">
                  {selectedAlert.userName || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {selectedAlert.userId}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 w-full rounded-xl border-gray-200 hover:bg-gray-50"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
