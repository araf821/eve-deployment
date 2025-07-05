"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ReceivedRequestCard } from "./ReceivedRequestCard";
import { SentRequestCard } from "./SentRequestCard";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";

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

export function BuddyRequestsList() {
  const [receivedRequests, setReceivedRequests] = useState<
    ReceivedBuddyRequest[]
  >([]);
  const [sentRequests, setSentRequests] = useState<SentBuddyRequest[]>([]);
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
        setReceivedRequests(data.receivedRequests || []);
        setSentRequests(data.sentRequests || []);
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
        // Remove the request from the received requests list
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
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

  const handleCancelRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const response = await fetch(
        `/api/buddies/requests/${requestId}/cancel`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Buddy request canceled");
        // Remove the request from the sent requests list
        setSentRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        throw new Error(result.error || "Failed to cancel request");
      }
    } catch (error) {
      console.error("Cancel request error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <EmptyState type="loading" />;
  }

  if (error) {
    return <EmptyState type="error" error={error} onRetry={fetchRequests} />;
  }

  if (receivedRequests.length === 0 && sentRequests.length === 0) {
    return <EmptyState type="empty" />;
  }

  return (
    <div className="space-y-6 px-1">
      {/* Received Requests Section */}
      {receivedRequests.length > 0 && (
        <section>
          <SectionHeader type="received" count={receivedRequests.length} />
          <div className="space-y-3">
            {receivedRequests.map(request => (
              <ReceivedRequestCard
                key={request.id}
                request={request}
                onAccept={id => handleRequestAction(id, "accept")}
                onReject={id => handleRequestAction(id, "reject")}
                isLoading={actionLoading === request.id}
              />
            ))}
          </div>
        </section>
      )}

      {/* Sent Requests Section */}
      {sentRequests.length > 0 && (
        <section>
          <SectionHeader type="sent" count={sentRequests.length} />
          <div className="space-y-3">
            {sentRequests.map(request => (
              <SentRequestCard
                key={request.id}
                request={request}
                onCancel={handleCancelRequest}
                isLoading={actionLoading === request.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
