"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCheck, UserX, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

interface BuddyRequest {
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

export function BuddyRequestsList() {
  const [requests, setRequests] = useState<BuddyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/buddies/requests");
      const data = await response.json();

      if (response.ok) {
        setRequests(data.requests);
        setError(null);
      } else {
        const errorMessage = data.error || "Failed to load buddy requests";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Fetch requests error:", error);
      const errorMessage = "Failed to load buddy requests";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(`/api/buddies/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          action === "accept"
            ? "Buddy request accepted!"
            : "Buddy request rejected"
        );
        // Remove the request from the list
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        throw new Error(result.error || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`${action} request error:`, error);
      toast.error(
        error instanceof Error ? error.message : `Failed to ${action} request`
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="text-muted-foreground">Loading requests...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
          <Button onClick={fetchRequests} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Mail size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="mb-2 font-heading text-lg font-semibold">
            No buddy requests
          </h3>
          <p className="text-muted-foreground">
            When someone sends you a buddy request, it will appear here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <Card key={request.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserCheck size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold">
                    {request.sender.name || "New User"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {request.sender.email}
                  </p>
                </div>
              </div>

              <div className="ml-13">
                <p className="mb-2 text-sm">
                  Wants to add you as <strong>{request.nickname}</strong>
                </p>
                {request.phoneNumber && (
                  <p className="mb-2 text-sm text-muted-foreground">
                    Phone: {request.phoneNumber}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="ml-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRequestAction(request.id, "reject")}
                disabled={actionLoading === request.id}
                className="h-9"
              >
                <UserX size={14} className="mr-1" />
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => handleRequestAction(request.id, "accept")}
                disabled={actionLoading === request.id}
                className="h-9"
              >
                <UserCheck size={14} className="mr-1" />
                Accept
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
