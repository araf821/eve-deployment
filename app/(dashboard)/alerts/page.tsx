import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { AlertModalWrapper } from "@/components/alert-wrapper";
import Image from "next/image";
import { db } from "@/server/db";
import { alertsTable, usersTable } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { BuddiesPageHeader } from "@/components/buddies";

export default async function AlertsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch recent alerts from the database
  const alerts = await db
    .select({
      id: alertsTable.id,
      lat: alertsTable.lat,
      lng: alertsTable.lng,
      address: alertsTable.address,
      createdAt: alertsTable.createdAt,
      userName: usersTable.name,
    })
    .from(alertsTable)
    .leftJoin(usersTable, eq(alertsTable.userId, usersTable.id))
    .orderBy(desc(alertsTable.createdAt))
    .limit(20);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-accent/50 px-4 pt-12 pb-8">
        <Image
          src="/logo.svg"
          alt="NiteLite Logo"
          width={64}
          height={64}
          priority
          className="mb-8"
        />
        <PageHeader
          title="All Alerts"
          subtitle="Incidents raised by other users"
        />
      </header>

      <div className="px-4 py-6">
        {/* Report Incident Button */}
        <section className="mb-6 space-y-4">
          <AlertModalWrapper>
            <button className="w-full rounded-lg bg-[#FF6767]/50 p-1.5">
              <div className="flex h-16 items-center justify-center rounded-lg bg-[#FF6767] p-4 text-lg font-semibold text-red-50">
                Report Incident
              </div>
            </button>
          </AlertModalWrapper>
        </section>

        <hr className="mb-6" />

        {/* Alerts List */}
        <section className="mb-8 space-y-4">
          {alerts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No recent alerts in your area.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-border bg-card/70 p-4 shadow-sm"
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {formatDate(alert.createdAt)},{" "}
                        {formatTime(alert.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      @{" "}
                      {alert.address ||
                        `${alert.lat.toFixed(4)}, ${alert.lng.toFixed(4)}`}
                    </p>
                    {alert.userName && (
                      <p className="text-xs text-muted-foreground">
                        Reported by {alert.userName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
