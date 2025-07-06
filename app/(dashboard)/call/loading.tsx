import { Skeleton } from "@/components/ui/skeleton";

export default function CallLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Profile Section */}
      <div className="flex flex-1 flex-col items-center justify-center space-y-6 px-6">
        {/* Avatar */}
        <div className="relative">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full" />
        </div>

        {/* Name and Status */}
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-32" />
          <Skeleton className="mx-auto h-5 w-24" />
        </div>

        {/* Call Duration */}
        <Skeleton className="h-6 w-20" />

        {/* Audio Visualizer */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-1 rounded-full" />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="flex items-center justify-center space-x-8">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
