"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, X, Send } from "lucide-react";
import Image from "next/image";

interface SentBuddyRequest {
  id: string;
  nickname: string;
  phoneNumber: string | null;
  status: string;
  createdAt: string;
  receiver: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface SentRequestCardProps {
  request: SentBuddyRequest;
  onCancel: (requestId: string) => void;
  isLoading: boolean;
}

export function SentRequestCard({
  request,
  onCancel,
  isLoading,
}: SentRequestCardProps) {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="p-4">
        {/* User Info Section */}
        <div className="mb-4 flex items-center gap-3">
          {request.receiver.image ? (
            <Image
              src={request.receiver.image}
              alt={request.receiver.name || "User"}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Send size={20} className="text-gray-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading font-semibold text-gray-900">
              {request.receiver.name || "New User"}
            </h3>
            <p className="truncate text-sm text-gray-600">
              {request.receiver.email}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
            <Clock size={12} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Pending</span>
          </div>
        </div>

        {/* Request Details */}
        <div className="mb-4 space-y-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-700">
              You want to add them as{" "}
              <span className="font-semibold text-gray-900">
                {request.nickname}
              </span>
            </p>
            {request.phoneNumber && (
              <p className="mt-1 text-xs text-gray-600">
                📱 {request.phoneNumber}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Send size={12} />
            <span>
              Sent{" "}
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCancel(request.id)}
          disabled={isLoading}
          className="relative h-11 w-full"
        >
          <X size={16} className="absolute left-3" />
          <span className="flex-1 text-center">Cancel Request</span>
        </Button>
      </div>
    </Card>
  );
}
