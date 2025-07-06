import { Skeleton } from "@/components/ui/skeleton";

export default function MapLoading() {
  return (
    <div className="relative h-screen w-full">
      {/* Map skeleton */}
      <Skeleton className="h-full w-full" />

      {/* Search bar skeleton */}
      <div className="absolute top-4 right-4 left-4">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* FAB buttons skeleton */}
      <div className="absolute right-4 bottom-20 space-y-3">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>

      {/* Status indicator skeleton */}
      <div className="absolute top-20 left-4">
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
    </div>
  );
}
