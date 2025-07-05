"use client";

import { UserCheck, Send } from "lucide-react";

interface SectionHeaderProps {
  type: "received" | "sent";
  count: number;
}

export function SectionHeader({ type, count }: SectionHeaderProps) {
  const isReceived = type === "received";

  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
        {isReceived ? (
          <UserCheck size={20} className="text-gray-600" />
        ) : (
          <Send size={20} className="text-gray-600" />
        )}
      </div>
      <div>
        <h2 className="font-heading text-lg font-semibold text-gray-900">
          {isReceived ? "Received Requests" : "Sent Requests"}
        </h2>
        <p className="text-sm text-gray-600">
          {count} {count === 1 ? "request" : "requests"}
          {isReceived ? " waiting for your response" : " pending"}
        </p>
      </div>
    </div>
  );
}
