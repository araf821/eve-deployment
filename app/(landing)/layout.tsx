import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NiteLite - Your Personal Campus Beacon",
  description:
    "A friendly digital companion that acts as a personal light in the dark, ensuring every student on campus feels connected and safe during any walk, day or night.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
