"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Users, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type: "loading" | "error" | "empty";
  onRetry?: () => void;
  error?: string;
}

export function EmptyState({ type, onRetry, error }: EmptyStateProps) {
  if (type === "loading") {
    return (
      <Card className="border shadow-sm">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600"></div>
            <p className="text-sm font-medium text-gray-600">
              Loading your buddy requests...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (type === "error") {
    return (
      <Card className="border shadow-sm">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <div className="h-6 w-6 rounded-full bg-gray-500"></div>
          </div>
          <h3 className="mb-2 font-heading text-lg font-semibold text-gray-900">
            Something went wrong
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            {error || "Failed to load buddy requests"}
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Try Again
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <div className="p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Mail size={32} className="text-gray-600" />
        </div>
        <h3 className="mb-2 font-heading text-xl font-semibold text-gray-900">
          No buddy requests yet
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-balance text-gray-600">
          When you send or receive buddy requests, they&apos;ll appear here.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="relative w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/buddies/add">
              <Plus size={16} className="absolute left-3" />
              <span className="flex-1 text-center">Add a Buddy</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="relative w-full">
            <Link href="/buddies">
              <Users size={16} className="absolute left-3" />
              <span className="flex-1 text-center">View Buddies</span>
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
