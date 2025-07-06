import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsLoading() {
  return (
    <>
      {/* Header */}
      <header className="bg-accent/50 px-4 pt-12 pb-8">
        <Skeleton className="mb-8 h-16 w-16" />
        <Skeleton className="absolute top-0 right-0 h-16 w-16 bg-transparent" />
        <div className="space-y-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-6 w-52" />
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Report Incident Button */}
        <section className="mb-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
        </section>

        <hr className="mb-6" />

        {/* Alerts List */}
        <section className="mb-8 space-y-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card/70 p-4 shadow-sm"
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
