import type { Metadata } from "next";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Button } from "@/components/ui/button"
import { Zap, Smile, MapPin, Expand, Bell, Home, MessageCircle, Phone, Settings, AlertTriangle } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-tr from-background to-purple-200 p-4">
      <div className="max-w-sm mx-auto space-y-6">
          {children}

        {/* Bottom Navigation */}
        <BottomNav />

        <div className="h-20"></div>
      </div>
    </div>
  );
}
