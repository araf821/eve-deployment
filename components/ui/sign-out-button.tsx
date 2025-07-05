// components/sign-out-button.tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/sign-in",
      redirect: true
    });
  };

  return (
    <Button 
      onClick={handleSignOut}
      variant="outline"
      className="w-full h-12 bg-white/90 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg"
    >
      Sign Out
    </Button>
  );
}