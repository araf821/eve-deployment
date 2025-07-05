"use client";

import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  children: React.ReactNode;
}

export default function SignOutButton({ children }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
    >
      {children}
    </button>
  );
}
