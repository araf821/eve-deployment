import { getCurrentUser } from "@/server/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Smile, Expand, Bell, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { AlertModalWrapper } from "@/components/alert-wrapper";
import { SuccessMessage } from "@/components/success-msg";
import MiniMapComponent from "@/components/MiniMapComponent";
// import CurrentLocation from "@/components/CurrentLocation";
import Image from "next/image";
interface DashboardProps {
  searchParams: { success?: string };
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const resolvedSearchParams = await searchParams;
  const showSuccess = resolvedSearchParams.success === "true";

  return (
    <>
      {/* Header */}
      <header className="px-4 pt-12 pb-6">
        <Image
          src="/logo.svg"
          alt="NiteLite Logo"
          width={64}
          height={64}
          priority
          className="mb-8"
        />
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Welcome,{" "}
            <span className="text-primary">{user.name?.split(" ")[0]}</span>.
          </h1>
          <p className="font-heading text-lg text-muted-foreground italic">
            Happy Saturday.
          </p>
        </div>
      </header>

      <div className="">
        <hr />

        {showSuccess && <SuccessMessage />}

        {/* Location Card */}
        {/* <CurrentLocation /> */}

        {/* Buddies Section - Most Important */}
        <section className="space-y-4 px-4 py-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Quick Actions
          </h2>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex h-16 w-full items-center justify-center border-border bg-card shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md"
          >
            <Link href="/buddies">
              <Users className="mr-3 size-6 text-primary" />
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-foreground">
                  Manage Buddies
                </span>
                <span className="text-sm text-muted-foreground">
                  Connect with your safety network
                </span>
              </div>
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex h-32 flex-col items-center justify-center space-y-3 border-border bg-card shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md"
            >
              <Zap className="text-primary" size={32} />
              <span className="text-sm font-medium text-foreground">
                Call Eve
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex h-32 flex-col items-center justify-center space-y-3 border-border bg-card shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md"
            >
              <Smile className="text-primary" size={32} />
              <span className="text-sm font-medium text-foreground">
                Speed Dial Jerry
              </span>
            </Button>
          </div>
        </section>

        <hr className="border-t-4" />

        {/* Emergency Section */}
        <section className="space-y-4 px-4 py-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Emergency
          </h2>

          <AlertModalWrapper>
            {/* <Button className="h-16 w-full rounded-xl bg-red-500 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-xl">
              <AlertTriangle className="mr-3 size-6" />
              <div className="flex flex-col items-start">
                <span>Report Incident</span>
                <span className="text-xs opacity-90">to Safety Centre</span>
              </div>
            </Button> */}

            <button className="w-full rounded-lg bg-[#FF6767]/50 p-1.5">
              <div className="flex h-16 items-center justify-center rounded-lg bg-[#FF6767] p-4 text-lg font-semibold">
                Report Incident
              </div>
            </button>
          </AlertModalWrapper>
        </section>

        <hr className="border-t-4" />

        {/* Mini Map Section */}
        <section className="space-y-4 px-4 py-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Your Area
          </h2>

          <div className="relative h-48 overflow-hidden rounded-xl shadow-lg">
            <MiniMapComponent className="h-full w-full rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full border-border bg-card text-foreground shadow-sm hover:bg-accent"
            >
              <Link href="/map" className="flex-1">
                <Expand className="mr-2 h-5 w-5" />
                View Full Map
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full border-border bg-card text-foreground shadow-sm hover:bg-accent"
              asChild
            >
              <Link href="/map" className="flex-1">
                <Bell className="mr-2 h-5 w-5" />
                Recent Alerts
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
