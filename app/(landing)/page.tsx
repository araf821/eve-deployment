import { getCurrentUser } from "@/server/lib/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Sparkle } from "lucide-react"
import { TypingAnimation } from "@/components/ui/typing-animation";

export default async function Home() {
  const user = await getCurrentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-background to-purple-300 flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-8 max-w-sm w-full">
        <div className="relative">
          <div className="w-16 h-16 flex items-center justify-center">
            <Sparkle className="w-8 h-8 text-black animate-spin" />
          </div>
        </div>
        {/* Main Heading with Typing Animation */}
        <div className="text-center space-y-2">
          <TypingAnimation />
          <p className="text-black text-lg">with Eve.</p>
        </div>
        {/* Spacer */}
        <div className="flex-1 min-h-[14vh]"></div>
        {/* Discord Login Button */}
        <Button
          className="w-full bg-transparent border-none text-gray-700 bg-white/70 hover:bg-white/20 text-base font-normal"
          variant="ghost"
        >
          <img src="google.png" className="w-5 h-5" />
          Continue with Google
        </Button>
        <Button
          className="w-full bg-transparent border-none text-gray-700 bg-white/70 hover:bg-white/20 text-base font-normal"
          variant="ghost"
        >
          <img src="discord.png" className="w-7 h-7" />
          Continue with Discord
        </Button>
      </div>
      <img src="logo.svg" className="absolute bottom-0 py-10" />
    </div>
  );
}
