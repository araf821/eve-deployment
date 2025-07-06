import { getCurrentUser } from "@/server/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Smile, Bell, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { InstantAlertButton } from "@/components/InstantAlertButton";
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
      <header className="bg-accent px-4 pt-12 pb-6">
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
            className="relative flex h-16 w-full items-center justify-center border-border bg-card/70 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md"
          >
            <Link href="/buddies">
              <Users className="absolute left-3 mr-3 size-6 text-primary" />
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
              className="flex h-32 flex-col items-center justify-center space-y-3 border-border bg-card/70 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md"
            >
              <Zap className="text-primary" size={32} />
              <span className="text-sm font-medium text-foreground">
                Call Eve
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex h-32 flex-col items-center justify-center space-y-3 border-border bg-card/70 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md"
            >
              <Smile className="text-primary" size={32} />
              <span className="text-sm font-medium text-foreground">
                Speed Dial Jerry
              </span>
            </Button>
          </div>
        </section>

        <hr className="border-t-2" />

        {/* Emergency Section */}
        <section className="space-y-4 px-4 py-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Emergency
          </h2>

          <InstantAlertButton />
        </section>

        <hr className="border-t-2" />

        {/* Mini Map Section */}
        <section className="space-y-4 px-4 py-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Your Area
          </h2>

          <div className="relative h-48 overflow-hidden rounded-xl shadow-lg">
            <MiniMapComponent className="h-full w-full rounded-xl" />
          </div>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-12 w-full border-border bg-card text-foreground shadow-sm hover:bg-accent"
          >
            <Link href="/map" className="flex-1">
              <Bell className="mr-2 h-5 w-5" />
              Recent Alerts
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}
