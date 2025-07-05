"use client";

import { signIn } from "next-auth/react";

interface SignInButtonProps {
  provider: "google" | "discord";
  children: React.ReactNode;
}

export default function SignInButton({
  provider,
  children,
}: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn(provider)}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      {children}
    </button>
  );
}
