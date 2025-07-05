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
        setRequestCount(data.requests.length);
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
        <Button className="h-12 w-full">
          <UserPlus size={20} className="mr-2" />
          Add Buddy
        </Button>
      </Link>

      <Link href="/buddies/requests">
        <Button variant="outline" className="relative h-12">
          <Bell size={20} className="mr-2" />
          Requests
          {!loading && requestCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {requestCount > 9 ? "9+" : requestCount}
            </span>
          )}
        </Button>
      </Link>
    </div>
  );
}
