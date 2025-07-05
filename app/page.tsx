import { getCurrentUser } from "@/server/lib/auth";
import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";
import Image from "next/image";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">NextAuth Demo</h1>
        <p className="text-gray-600">
          Authentication with Google & Discord using NextAuth, Drizzle, and Neon
          DB
        </p>
      </div>

      {user ? (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border p-6 text-center">
            <h2 className="mb-2 text-xl font-semibold">Welcome back!</h2>
            <p className="mb-2">
              <strong>Name:</strong> {user.name || "No name"}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {user.email || "No email"}
            </p>
            <p className="mb-4">
              <strong>User ID:</strong> {user.id}
            </p>
            {user.image && (
              <Image
                src={user.image}
                alt="Profile"
                className="mx-auto mb-4 h-16 w-16 rounded-full"
                width={64}
                height={64}
              />
            )}
          </div>
          <SignOutButton>Sign Out</SignOutButton>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">Please sign in to continue</p>
          <div className="flex gap-4">
            <SignInButton provider="google">Sign in with Google</SignInButton>
            <SignInButton provider="discord">Sign in with Discord</SignInButton>
          </div>
        </div>
      )}
    </div>
  );
}
