import { Skeleton } from "@/components/ui/skeleton";

export default function StartWalkLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-9 w-64" />
        <Skeleton className="h-6 w-80" />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <Skeleton className="mb-4 h-7 w-32" />
        <Skeleton className="mb-2 h-5 w-full" />
        <div className="mt-2 space-y-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
