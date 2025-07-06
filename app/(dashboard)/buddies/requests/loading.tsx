import { Skeleton } from "@/components/ui/skeleton";

export default function BuddyRequestsLoading() {
  return (
    <div className="container mx-auto max-w-md">
      <header className="bg-accent/50 px-4 pt-12 pb-8">
        <div className="flex items-center justify-between">
          <Skeleton className="mb-8 h-16 w-16" />
          <Skeleton className="mb-6 h-10 w-32 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-6 w-80" />
        </div>
      </header>

      <hr />

      <section className="px-4 py-6">
        {/* BuddyRequestsList skeleton */}
        <div className="space-y-6">
          {/* Received Requests Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-6 w-8" />
            </div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card/70 p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-16 rounded" />
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sent Requests Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-6 w-8" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card/70 p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
