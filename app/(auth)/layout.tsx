import type { Metadata } from "next";
import Image from "next/image";
import { Sparkle } from "lucide-react";

export const metadata: Metadata = {
  title: "Join Eve - Campus Safety Community",
  description:
    "Sign in or sign up to join the Eve community and start feeling safer on campus walks.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-tl from-background to-purple-300 p-6">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8">
        {/* Logo and branding */}
        <div className="relative flex flex-col items-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center">
            <Sparkle className="h-8 w-8 animate-spin text-foreground" />
          </div>
          <div className="space-y-4 text-center font-heading">
            <h1 className="text-3xl font-bold text-foreground">Eve</h1>
            <p className="text-black/80">Campus safety through community</p>
          </div>
        </div>

        {/* Auth content */}
        <div className="w-full">{children}</div>
        <Image
          src="/logo.svg"
          alt="Eve Logo"
          width={64}
          height={64}
          className="absolute bottom-0 py-10"
        />
      </div>

      {/* Bottom logo */}
    </div>
  );
}
