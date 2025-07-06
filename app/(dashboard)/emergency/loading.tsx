import { Skeleton } from "@/components/ui/skeleton";

export default function EmergencyLoading() {
  return (
    <div className="relative space-y-6 md:space-y-12">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-accent/20 to-primary/30 blur-3xl" />
      </div>

      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40 md:h-9 md:w-48" />
        <Skeleton className="h-5 w-64 md:h-6 md:w-80" />
      </div>

      {/* Emergency SOS Button */}
      <div className="space-y-3 md:space-y-4">
        <Skeleton className="h-5 w-32 md:h-6 md:w-36" />
        <Skeleton className="h-4 w-56 md:h-5 md:w-64" />
        <Skeleton className="h-14 w-full rounded-lg md:h-16" />
      </div>

      {/* Emergency Contacts */}
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-40 md:h-6 md:w-44" />
        <div className="space-y-2 md:space-y-3">
          <Skeleton className="h-12 w-full rounded-lg md:h-14" />
          <Skeleton className="h-12 w-full rounded-lg md:h-14" />
        </div>
      </div>

      {/* Share Location */}
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-32 md:h-6 md:w-36" />
        <Skeleton className="h-12 w-full rounded-lg md:h-14" />
      </div>

      {/* Alert Buddies */}
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-5 w-28 md:h-6 md:w-32" />
        <Skeleton className="h-12 w-full rounded-lg md:h-14" />
      </div>
    </div>
  );
}
