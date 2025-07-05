import { getCurrentUser } from "@/server/lib/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Heart, Rocket } from "lucide-react"

export default async function Home() {
  const user = await getCurrentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-300 flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-8 max-w-sm w-full">
        {/* App Icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
          </div>
        </div>

        {/* Rocket Icon */}
        <div className="text-gray-700">
          <Rocket className="w-12 h-12" />
        </div>

        {/* Main Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-black">Stay Safe. Feel Seen.</h1>
          <p className="text-gray-700 italic text-lg">You don't have to be alone.</p>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[100px]"></div>

        {/* Discord Login Button */}
        <Button
          className="w-full bg-transparent border-none text-gray-700 hover:bg-white/20 text-base font-normal"
          variant="ghost"
        >
          Log in with Discord
        </Button>
      </div>
    </div>
  );
}
