import { getCurrentUser } from "@/server/lib/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Sparkle } from "lucide-react";
import { TypingAnimation } from "@/components/typing-animation";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const user = await getCurrentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tl from-background to-purple-300 p-6">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center">
            <Sparkle className="h-8 w-8 animate-spin text-black" />
          </div>
        </div>
        {/* Main Heading with Typing Animation */}
        <div className="space-y-2 text-center">
          <TypingAnimation />
          <p className="text-lg text-black">with Eve.</p>
        </div>
        {/* Spacer */}
        <div className="min-h-[3vh] flex-1"></div>
        {/* Discord Login Button */}
        <Link href="/sign-in">
          <Button
            className="w-40 border-none bg-white/70 text-base font-normal text-gray-700 hover:bg-white/20"
            variant="ghost"
          >
            Get Started
          </Button>
        </Link>
      </div>
      <Image src="logo.svg" alt="Logo" className="absolute bottom-0 py-10" />
    </div>
  );
}
