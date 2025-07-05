import type { Metadata } from "next";

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
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-tl from-background to-purple-300 p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
