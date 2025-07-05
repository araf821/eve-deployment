import type { Metadata } from "next";
import { BottomNav } from "@/components/ui/bottom-nav";

export const metadata: Metadata = {
  title: "NiteLite Dashboard",
  description:
    "Manage your buddies, start walks, and stay connected with your campus safety community.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-screen-md">
        <main className="p-4 pb-20 md:pb-24">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
