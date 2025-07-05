import type { Metadata } from "next";
import { BottomNav } from "@/components/ui/bottom-nav";
import TopBar from "@/components/layout/TopBar";

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
        <main className="flex flex-col gap-8 px-4 pb-24 md:pb-28">
          <TopBar />
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
