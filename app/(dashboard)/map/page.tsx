import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";

export default async function CommunityMapPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Glow Map</h1>
        <p className="text-muted-foreground">
          See campus safety insights from your community
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">
          The community map will be implemented here. Features will include:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Interactive campus map</li>
          <li>Community &quot;Glow&quot; pins (safe spots)</li>
          <li>&quot;Heads-up&quot; pins (areas to be aware of)</li>
          <li>Real-time buddy locations</li>
          <li>Safe route suggestions</li>
          <li>Add your own community pins</li>
        </ul>
      </div>
    </div>
  );
}
