import type { Metadata } from "next";
import { BottomNav } from "@/components/ui/bottom-nav";

export const metadata: Metadata = {
  title: "Eve",
  description:
    "Manage your buddies, start walks, and stay connected with your campus safety community.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-tr from-background to-purple-100 pb-12">
      <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-primary/15 blur-2xl" />

      <div className="mx-auto max-w-md pb-4 sm:rounded-b-lg sm:border-x sm:border-b">
        {children}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
