"use client";

import { useState, useEffect } from "react";
import { ContactCard } from "./ContactCard";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Buddy {
  id: string;
  nickname: string;
  phoneNumber: string | null;
  createdAt: string;
  lat?: string;
  lng?: string;
  name?: string;
  email?: string;
  image?: string;
  lastSeen?: Date;
}

export function ContactsSection() {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuddies();
  }, []);

  const fetchBuddies = async () => {
    try {
      const response = await fetch("/api/buddies");
      const data = await response.json();

      if (response.ok) {
        // The API returns the buddies array directly, not wrapped in a 'buddies' property
        setBuddies(Array.isArray(data) ? data : []);
        setError(null);
      } else {
        const errorMessage = data.error || "Failed to load buddies";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Fetch buddies error:", error);
      setError("Failed to load buddies");
    } finally {
      setLoading(false);
    }
  };

  const handleBuddyDeleted = (buddyId: string) => {
    setBuddies(prev => prev.filter(buddy => buddy.id !== buddyId));
  };

  if (loading) {
    return (
      <section className="px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Users size={24} className="text-primary" />
          <h2 className="font-heading text-2xl font-bold text-foreground">
            My Buddies
          </h2>
        </div>
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading buddies...</div>
          </div>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Users size={24} className="text-primary" />
          <h2 className="font-heading text-2xl font-bold text-foreground">
            My Buddies
          </h2>
        </div>
        <Card className="p-8">
          <div className="text-center">
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
            <Button onClick={fetchBuddies} variant="outline">
              Try Again
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Users size={24} className="text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">
          My Buddies
        </h2>
      </div>

      {(!buddies || buddies.length === 0) ? (
        <Card className="p-8">
          <div className="text-center">
            <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 font-heading text-lg font-semibold">
              No buddies yet
            </h3>
            <p className="text-muted-foreground">
              Add your first buddy to start building your safety network!
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {buddies.map(buddy => (
            <ContactCard
              key={buddy.id}
              id={buddy.id}
              name={buddy.nickname}
              email={buddy.email || ""}
              phoneNumber={buddy.phoneNumber}
              onDeleted={handleBuddyDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
}
