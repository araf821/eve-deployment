"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone, MoreVertical, Trash2, User } from "lucide-react";
import { toast } from "sonner";

interface ContactCardProps {
  id?: string;
  name: string;
  email?: string;
  phoneNumber?: string | null;
  href?: string;
  onDeleted?: (buddyId: string) => void;
}

export function ContactCard({
  id,
  name,
  email,
  phoneNumber,
  href = "/call",
  onDeleted,
}: ContactCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id || !onDeleted) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/buddies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Buddy removed successfully");
        onDeleted(id);
        setIsDialogOpen(false);
      } else {
        const result = await response.json();
        throw new Error(result.error || "Failed to remove buddy");
      }
    } catch (error) {
      console.error("Delete buddy error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove buddy"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // If this is a real buddy (has id), show the dialog trigger
  if (id && onDeleted) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between rounded-xl bg-card p-6 shadow-sm backdrop-blur-sm transition-all hover:bg-card/90 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <span className="font-heading text-lg font-semibold text-foreground">
                  {name}
                </span>
                {email && (
                  <p className="text-sm text-muted-foreground">{email}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-accent"
            >
              <MoreVertical size={20} className="text-primary" />
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User size={20} />
              {name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {email && (
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Email</p>
                <p className="text-sm">{email}</p>
              </div>
            )}

            {phoneNumber && (
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Phone</p>
                <p className="text-sm">{phoneNumber}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Link href={href} className="flex-1">
                <Button className="h-10 w-full">
                  <Phone size={16} className="mr-2" />
                  Call
                </Button>
              </Link>

              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-10"
              >
                <Trash2 size={16} className="mr-2" />
                {isDeleting ? "Removing..." : "Remove"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Fallback for non-buddy contacts (like the original behavior)
  return (
    <Link href={href} className="block">
      <div className="flex cursor-pointer items-center justify-between rounded-xl bg-card p-6 shadow-sm backdrop-blur-sm transition-all hover:bg-card/90 hover:shadow-md">
        <span className="font-heading text-lg font-semibold text-foreground">
          {name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full hover:bg-accent"
        >
          <Phone size={20} className="text-primary" />
        </Button>
      </div>
    </Link>
  );
}
