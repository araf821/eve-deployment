"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "../ui/icons";

interface SocialLoginProps {
  providers: string[];
  className?: string;
}

export default function SocialLogin({
  providers,
  className,
}: SocialLoginProps) {
  const getProviderConfig = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return {
          name: "Google",
          icon: <Icons.google className="h-4 w-4" />,
          variant: "outline" as const,
        };
      case "discord":
        return {
          name: "Discord",
          icon: <Icons.discord className="h-4 w-4" />,
          variant: "outline" as const,
        };
      default:
        return {
          name: provider,
          icon: null,
          variant: "outline" as const,
        };
    }
  };

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, { 
        callbackUrl: "/dashboard",
        redirect: true 
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className || ""}`}>
      {providers.map(provider => {
        const config = getProviderConfig(provider);
        return (
          <Button
            key={provider}
            variant={config.variant}
            onClick={() => handleSignIn(provider)}
            className="w-full"
          >
            {config.icon}
            Continue with {config.name}
          </Button>
        );
      })}
    </div>
  );
}