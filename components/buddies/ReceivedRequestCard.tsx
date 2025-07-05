"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCheck, UserX, Clock } from "lucide-react";
import Image from "next/image";

interface ReceivedBuddyRequest {
  id: string;
  nickname: string;
  phoneNumber: string | null;
  status: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface ReceivedRequestCardProps {
  request: ReceivedBuddyRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isLoading: boolean;
}

export function ReceivedRequestCard({
  request,
  onAccept,
  onReject,
  isLoading,
}: ReceivedRequestCardProps) {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="p-4">
        {/* User Info Section */}
        <div className="mb-4 flex items-center gap-3">
          {request.sender.image ? (
            <Image
              src={request.sender.image}
              alt={request.sender.name || "User"}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
              <UserCheck size={20} className="text-gray-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading font-semibold text-gray-900">
              {request.sender.name || "New User"}
            </h3>
            <p className="truncate text-sm text-gray-600">
              {request.sender.email}
            </p>
          </div>
        </div>

        {/* Request Details */}
        <div className="mb-4 space-y-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-700">
              Wants to add you as{" "}
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
            <Clock size={12} />
            <span>
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            size="sm"
            onClick={() => onAccept(request.id)}
            disabled={isLoading}
            className="relative h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <UserCheck size={16} className="absolute left-3" />
            <span className="flex-1 text-center">Accept</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(request.id)}
            disabled={isLoading}
            className="relative h-11 w-full"
          >
            <UserX size={16} className="absolute left-3" />
            <span className="flex-1 text-center">Decline</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
