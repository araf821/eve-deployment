import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ActiveWalkPage({ params }: Props) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active Walk</h1>
        <p className="text-muted-foreground">Walk ID: {id}</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">
          Active walk tracking will be implemented here. Features will include:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Real-time location tracking</li>
          <li>Buddy monitoring dashboard</li>
          <li>Emergency alert button</li>
          <li>AI Guardian status</li>
          <li>Route progress tracking</li>
          <li>End walk functionality</li>
        </ul>
      </div>
    </div>
  );
}
