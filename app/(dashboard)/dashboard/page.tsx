import { getCurrentUser } from "@/server/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Smile, MapPin, Expand, Bell, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import { AlertModalWrapper } from "@/components/alert-wrapper";
import { SuccessMessage } from "@/components/success-msg";
interface DashboardProps {
  searchParams: { success?: string };
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const showSuccess = searchParams.success === "true";

  return (
    <>
      {/* Header */}
      <div className="pt-8 pb-4">
        <div className="mb-6 text-2xl font-bold text-black">
          <img src="logo.svg" />
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-bold text-black">
            Welcome,{" "}
            <span className="text-purple-600">{user.name?.split(" ")[0]}</span>.
          </h1>
          <p className="text-black italic">Happy Saturday.</p>
        </div>
      </div>

      {showSuccess && <SuccessMessage />}

      {/* Location Card */}
      <div className="mb-3 text-xs text-gray-800 italic">
        Your Location: Mohel Centre, 31 St George St, Toronto
      </div>

      {/* Map Placeholder */}
      <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 shadow-md">
        <img
          src="/placeholder.svg?height=200&width=300"
          alt="Campus map showing current location"
          className="h-full w-full object-cover"
        />
        {/* Location pins overlay */}
        <div className="absolute top-4 left-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
            <MapPin className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="absolute right-4 bottom-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
            <MapPin className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/map">
          <Button
            variant="ghost"
            size="sm"
            className="border-gray-200 bg-white/90 px-8 text-gray-600 shadow-lg backdrop-blur-sm hover:bg-white"
          >
            <Expand className="mr-2 h-4 w-4" />
            Expand
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="border-gray-200 bg-white/90 px-8 text-gray-600 shadow-lg backdrop-blur-sm hover:bg-white"
        >
          <Bell className="mr-2 h-4 w-4" />
          Recent Alerts
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex h-40 flex-col items-center justify-center space-y-2 border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
        >
          <Zap className="text-black" style={{ width: "8vh", height: "8vh" }} />
          <span className="text-sm font-medium text-black">Call Eve</span>
        </Button>

        <Button
          variant="outline"
          className="flex h-40 flex-col items-center justify-center space-y-2 border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white"
        >
          <Smile
            className="text-black"
            style={{ width: "8vh", height: "8vh" }}
          />
          <span className="text-sm font-medium text-black">
            Speed Dial Jerry
          </span>
        </Button>
      </div>

      {/* Report Incident Button */}
      <AlertModalWrapper>
        <Button className="h-14 w-full rounded-xl bg-red-500 text-lg font-medium text-white hover:bg-red-600">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Report Incident
          <div className="ml-2 text-xs opacity-80">to Safety Centre</div>
        </Button>
      </AlertModalWrapper>
    </>
  );
}
