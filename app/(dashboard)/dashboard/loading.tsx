import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      {/* Header */}
      <header className="bg-accent/50 px-4 pt-12 pb-6">
        <Skeleton className="mb-8 h-16 w-16" />
        <div className="space-y-1">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-7 w-40" />
        </div>
      </header>

      <div className="">
        <hr />

        {/* Quick Actions Section */}
        <section className="space-y-4 px-4 py-6">
          <Skeleton className="h-8 w-32" />

          <Skeleton className="h-16 w-full rounded-lg" />

          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </section>

        <hr className="border-t-2" />

        {/* Emergency Section */}
        <section className="space-y-4 px-4 py-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </section>

        <hr className="border-t-2" />

        {/* Mini Map Section */}
        <section className="space-y-4 px-4 py-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </section>
      </div>
    </>
  );
}
