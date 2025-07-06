"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Map, Cog, Users } from "lucide-react";
import Image from "next/image";

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/buddies",
    icon: Users,
    label: "Buddies",
  },
  {
    href: "/map",
    icon: Map,
    label: "Map",
  },
  {
    href: "/settings",
    icon: Cog,
    label: "Settings",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 w-full max-w-screen sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:px-4">
      <div className="h-16 bg-card shadow-[0_-4px_4px] shadow-black/5 max-sm:rounded-t-lg sm:mb-4 sm:rounded-xl sm:border sm:shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 sm:px-4">
          <Image
            src="navlogo.svg"
            className="px-4"
            alt="Logo"
            width={64}
            height={64}
          />

          {navItems.map(item => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-2 py-1 transition-colors",
                  "hover:bg-secondary/50 active:bg-secondary",
                  isActive
                    ? "bg-secondary/30 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "mb-1 size-5 transition-transform",
                    isActive ? "scale-110" : ""
                  )}
                />
                <span
                  className={cn(
                    "truncate text-xs font-medium",
                    isActive ? "font-semibold text-primary" : ""
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
