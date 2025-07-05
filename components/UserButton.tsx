"use client";

import { signOut, useSession } from "next-auth/react";
import { Settings, LogOut } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserButton = () => {
  const { data, status } = useSession();
  const user = data?.user;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full border-2 border-gray-200 bg-gray-100" />
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-200 transition-colors hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name || "User avatar"}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
