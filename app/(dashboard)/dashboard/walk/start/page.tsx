import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";

export default async function StartWalkPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Start a Guided Walk</h1>
        <p className="text-muted-foreground">
          Begin your safe journey with buddy tracking
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">
          Walk starting features will be implemented here. You&apos;ll be able
          to:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Set your destination</li>
          <li>Choose a buddy to track your walk</li>
          <li>Start real-time location sharing</li>
          <li>Enable AI Guardian monitoring</li>
          <li>Access emergency alerts</li>
        </ul>
      </div>
    </div>
  );
}
