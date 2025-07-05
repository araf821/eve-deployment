import type { Metadata } from "next";
import { BottomNav } from "@/components/ui/bottom-nav";

export const metadata: Metadata = {
  title: "Eve Dashboard",
  description:
    "Manage your buddies, start walks, and stay connected with your campus safety community.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-tr from-background to-purple-100 px-4 pt-12 pb-24">
      <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary/15 blur-2xl" />

      <div className="mx-auto max-w-md space-y-6">
        {children}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
