import { getCurrentUser } from "@/server/lib/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold">NiteLite</h1>
        <p className="mb-2 text-xl text-muted-foreground">
          Your Personal Campus Beacon
        </p>
        <p className="mb-8 text-muted-foreground">
          A friendly digital companion that acts as a personal light in the
          dark, ensuring every student on campus feels connected and safe during
          any walk, day or night.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <a href="/sign-up">Get Started</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>

      <div className="mt-8 max-w-2xl text-center">
        <h2 className="mb-4 text-2xl font-semibold">How NiteLite Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <h3 className="mb-2 font-semibold">Your Buddy System</h3>
            <p className="text-sm text-muted-foreground">
              Add trusted friends who can track your walks in real-time
            </p>
          </div>
          <div className="text-center">
            <h3 className="mb-2 font-semibold">AI Guardian</h3>
            <p className="text-sm text-muted-foreground">
              Smart monitoring that checks in if you stop moving unexpectedly
            </p>
          </div>
          <div className="text-center">
            <h3 className="mb-2 font-semibold">Community Glow Map</h3>
            <p className="text-sm text-muted-foreground">
              See safe routes and areas shared by your campus community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
