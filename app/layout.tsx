import type { Metadata } from "next";
import "./globals.css";
import { AuthSessionProvider } from "@/components/auth/AuthSessionProvider";
import { playfairDisplay, ubuntu } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Eve - Your Personal Campus Beacon",
  description:
    "A friendly digital companion that acts as a personal light in the dark, ensuring every student on campus feels connected and safe during any walk, day or night.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      <body
        className={`${playfairDisplay.variable} ${ubuntu.className} font-sans antialiased`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
