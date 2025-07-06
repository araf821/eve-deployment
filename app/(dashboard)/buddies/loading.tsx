import { Skeleton } from "@/components/ui/skeleton";

export default function BuddiesLoading() {
  return (
    <div className="">
      <header className="bg-accent/50 px-4 pt-12 pb-8">
        <Skeleton className="mb-8 h-16 w-16" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-6 w-56" />
        </div>
        {/* BuddiesPageHeader skeleton */}
        <div className="mt-6 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </header>

      <hr />

      {/* BuddiesSection skeleton */}
      <section className="space-y-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Buddy cards skeleton */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
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
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr />

      {/* ContactsSection skeleton */}
      <section className="space-y-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Contact cards skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card/70 p-4"
            >
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
