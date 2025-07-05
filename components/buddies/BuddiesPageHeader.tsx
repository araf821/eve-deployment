"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, Bell } from "lucide-react";

export function BuddiesPageHeader() {
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestCount();
  }, []);

  const fetchRequestCount = async () => {
    try {
      const response = await fetch("/api/buddies/requests");
      const data = await response.json();

      if (response.ok) {
        const receivedCount = data.receivedRequests?.length || 0;
        const sentCount = data.sentRequests?.length || 0;
        setRequestCount(receivedCount + sentCount);
      }
    } catch (error) {
      console.error("Fetch request count error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex gap-3">
      <Link href="/buddies/add" className="flex-1">
        <Button className="relative h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <UserPlus size={20} className="absolute left-3" />
          <span className="flex-1 text-center">Add Buddy</span>
        </Button>
      </Link>

      <Link href="/buddies/requests">
        <Button variant="outline" className="relative h-12">
          <Bell size={20} className="absolute left-3" />
          <span className="flex-1 text-center">Requests</span>
          {!loading && requestCount > 0 && (
            <span className="text-destructive-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs">
              {requestCount > 9 ? "9+" : requestCount}
            </span>
          )}
        </Button>
      </Link>
    </div>
  );
}
