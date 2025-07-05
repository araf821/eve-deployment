import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";

export default async function BuddiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Buddies</h1>
        <p className="text-muted-foreground">
          Manage your safety network and buddy connections
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">
          Buddy management features will be implemented here. You&apos;ll be
          able to:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Add and remove buddies</li>
          <li>Send buddy requests</li>
          <li>Manage buddy availability</li>
          <li>Set emergency contacts</li>
        </ul>
      </div>
    </div>
  );
}
