import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="">
      {/* Header */}
      <header className="bg-accent px-4 pt-12 pb-8">
        <Skeleton className="mb-8 h-16 w-16" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-6 w-64" />
        </div>
      </header>

      <hr />

      {/* Account Section */}
      <section className="space-y-4 px-4 py-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Name form */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm">
          <Skeleton className="mb-2 h-5 w-12" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-16 rounded" />
          </div>
        </div>

        {/* Email form */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm">
          <Skeleton className="mb-2 h-5 w-12" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-16 rounded" />
          </div>
        </div>

        {/* Password */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-16 rounded" />
          </div>
        </div>
      </section>

      <hr />

      {/* Preferences Section */}
      <section className="space-y-4 px-4 py-6">
        <Skeleton className="h-8 w-28" />

        {/* Preference items */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/70 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        ))}
      </section>

      <hr />

      {/* Sign Out Section */}
      <section className="px-4 py-6">
        <Skeleton className="h-12 w-full rounded-lg" />
      </section>
    </div>
  );
}
