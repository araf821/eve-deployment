import { getCurrentUser } from "@/server/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Zap, Smile, MapPin, Expand, Bell, Home, MessageCircle, Phone, Settings, AlertTriangle } from "lucide-react"
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
    {/* Header */}
        <div className="pt-8 pb-4">
          <div className="text-2xl font-bold text-black mb-2">
            <img src="logo.svg"/>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif text-black">
              Welcome, <span className="text-purple-600 font-bold">
                {user.name}
                </span>.
            </h1>
            <p className="text-black italic">Happy Saturday.</p>
          </div>
        </div>
      {/* Location Card */}
            <div className="text-xs text-gray-800 mb-3 italic">Your Location: Mohel Centre, 31 St George St, Toronto</div>

            {/* Map Placeholder */}
            <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="Campus map showing current location"
                className="w-full h-full object-cover"
              />
              {/* Location pins overlay */}
              <div className="absolute top-4 left-4">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Map Actions */}
            <div className="flex justify-between">
              <Button variant="ghost" size="sm" 
              className="text-gray-600 px-8 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg">
                <Expand className="w-4 h-4 mr-2" />
                Expand
              </Button>
              <Button variant="ghost" size="sm" 
              className="text-gray-600 px-8 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-lg">
                <Bell className="w-4 h-4 mr-2" />
                Recent Alerts
              </Button>
            </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-40 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <Zap className="text-black" style={{ width: "8vh", height: "8vh" }} />
            <span className="text-sm font-medium text-black">Call Eve</span>
          </Button>

          <Button
            variant="outline"
            className="h-40 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <Smile className="text-black" style={{ width: "8vh", height: "8vh" }} />
            <span className="text-sm font-medium text-black">Speed Dial Jerry</span>
          </Button>
        </div>

        {/* Report Incident Button */}
        <Button className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-medium text-lg rounded-xl">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Report Incident
          <div className="text-xs opacity-80 ml-2">to Safety Centre</div>
        </Button>
    </>
  );
}
