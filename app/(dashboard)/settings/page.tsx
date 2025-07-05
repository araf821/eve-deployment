import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Bell, Shield, HelpCircle, Info } from "lucide-react";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Server actions for updating user data
async function updateUserName(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const name = formData.get("name") as string;
  if (!name || name.trim() === "") return;

  await db
    .update(usersTable)
    .set({ name: name.trim() })
    .where(eq(usersTable.id, user.id));

  revalidatePath("/settings");
}

async function updateUserEmail(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const email = formData.get("email") as string;
  if (!email || email.trim() === "") return;

  await db
    .update(usersTable)
    .set({ 
      email: email.trim(),
      emailVerified: null
    })
    .where(eq(usersTable.id, user.id));

  revalidatePath("/settings");
}

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      {/* Header */}
      <div className="pt-8 pb-4">
        <div className="text-2xl font-bold text-black mb-6">
          <img src="logo.svg" alt="Logo" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-serif text-black">
            Settings
          </h1>
          <p className="text-black italic">Manage your account and preferences</p>
        </div>
      </div>

      {/* Account Section */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold text-black flex items-center">
          <User className="w-5 h-5 mr-2" />
          Account
        </h2>
        
        {/* Name */}
        <form action={updateUserName} className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name || ""}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your name"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Email */}
        <form action={updateUserEmail} className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user.email || ""}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your email"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Password */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black">Password</h3>
              <p className="text-sm text-gray-500">••••••••</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 border-gray-200 hover:bg-gray-50"
            >
              Change
            </Button>
          </div>
        </div>
      </div>

      {/* Other Settings */}
      <div className="space-y-3 mb-6">
        <h2 className="text-lg font-semibold text-black">Preferences</h2>
        
        {/* Notifications */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-black">Notifications</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 border-gray-200 hover:bg-gray-50"
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-black">Privacy & Security</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 border-gray-200 hover:bg-gray-50"
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Help and Support */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-black">Help and Support</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 border-gray-200 hover:bg-gray-50"
            >
              View
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-black">About</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 border-gray-200 hover:bg-gray-50"
            >
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-8">
        <Button 
          variant="outline"
          className="w-full h-12 bg-white/90 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium rounded-lg"
        >
          Sign Out
        </Button>
      </div>
    </>
  );
}