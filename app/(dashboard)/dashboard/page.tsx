import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">
          Ready to light up your next campus walk?
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Quick Start</h2>
          <p className="mb-4 text-muted-foreground">
            Start a guided walk with your buddies
          </p>
          <a
            href="/walk/start"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start Walk
          </a>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Your Buddies</h2>
          <p className="mb-4 text-muted-foreground">
            Manage your safety network
          </p>
          <a
            href="/buddies"
            className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            Manage Buddies
          </a>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-2 text-xl font-semibold">Community Map</h2>
        <p className="mb-4 text-muted-foreground">
          See what&apos;s happening around campus
        </p>
        <a
          href="/map"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/80"
        >
          View Map
        </a>
      </div>
    </div>
  );
}
