import { Skeleton } from "@/components/ui/skeleton";

export default function AddBuddyLoading() {
  return (
    <div>
      <header className="bg-accent/50 px-4 pt-12 pb-8">
        <div className="flex items-center justify-between">
          <Skeleton className="mb-8 h-16 w-16" />
          <Skeleton className="mb-6 h-10 w-32 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-6 w-72" />
        </div>
      </header>

      <hr />

      {/* AddBuddyForm skeleton */}
      <section className="px-4 py-6">
        <div className="space-y-6">
          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <Skeleton className="mb-2 h-5 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-2 h-5 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-2 h-5 w-24" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>

          {/* Submit button */}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </section>
    </div>
  );
}
