"use client";

import { Clock, User, MapPin, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Alert {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  description?: string;
  hasImage?: string;
  createdAt: Date;
  userId: string;
  userName?: string;
}

interface AlertModalProps {
  selectedAlert: Alert | null;
  isModalOpen: boolean;
  onClose: () => void;
  onAlertDeleted?: () => void;
}

export default function AlertModal({
  selectedAlert,
  isModalOpen,
  onClose,
  onAlertDeleted,
}: AlertModalProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = session?.user?.id === selectedAlert?.userId;

  const handleDelete = async () => {
    if (!selectedAlert || !session?.user?.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/alerts?id=${selectedAlert.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete alert");
      }

      // Close modal and refresh alerts
      onClose();
      onAlertDeleted?.();
    } catch (error) {
      console.error("Error deleting alert:", error);
      // You could add a toast notification here for better UX
    } finally {
      setIsDeleting(false);
    }
  };
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
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                <Clock className="size-5 text-blue-600" />
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
              <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
                <MapPin className="size-5 text-red-600" />
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

            {/* Description */}
            {selectedAlert.description && (
              <div className="flex items-start space-x-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-yellow-100">
                  <svg
                    className="size-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    Description
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAlert.description}
                  </p>
                </div>
              </div>
            )}

            {/* Photo Evidence */}
            {selectedAlert.hasImage === "true" && (
              <div className="flex items-start space-x-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                  <svg
                    className="size-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    Photo Evidence
                  </h3>
                  <p className="text-sm text-gray-600">
                    Photo evidence included with this report
                  </p>
                </div>
              </div>
            )}

            {/* User */}
            <div className="flex items-start space-x-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                <User className="size-5 text-green-600" />
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
          <div className="flex w-full gap-3">
            {isOwner && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-12 flex-1 rounded-xl"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="size-4" />
                    Delete
                  </div>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onClose()}
              className={`h-12 rounded-xl border-gray-200 hover:bg-gray-50 ${
                isOwner ? "flex-1" : "w-full"
              }`}
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
