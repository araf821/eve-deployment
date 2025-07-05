import type { Metadata } from "next";

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-md">
        {/* TODO: Add navigation header here */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
