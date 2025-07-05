"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Map, Cog, Shield, Phone } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/call",
    icon: Phone,
    label: "Call",
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
    <nav className="fixed right-0 bottom-0 left-0 z-50 md:left-1/2 md:max-w-screen-md md:-translate-x-1/2">
      <div className="bg-card shadow-[0_-4px_4px] shadow-black/5 max-md:rounded-t-lg md:mx-4 md:mb-4 md:rounded-xl md:border md:shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 md:px-4">
          <img src="navlogo.svg" className="px-4"/>
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
                  className={cn("mb-1 h-5 w-5", isActive ? "h-6 w-6" : "")}
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
