import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, HelpCircle, Info } from "lucide-react";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import SignOutButton from "@/components/ui/sign-out-button";

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
      emailVerified: null,
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
        <div className="mb-6 text-2xl font-bold text-black">
          <img src="logo.svg" alt="Logo" />
        </div>
        <div className="space-y-1">
          <h1 className="font-serif text-2xl font-bold text-black">Settings</h1>
          <p className="text-black italic">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Account Section */}
      <div className="mb-6 space-y-4">
        <h2 className="flex items-center text-lg font-semibold text-black">
          <User className="mr-2 h-5 w-5" />
          Account
        </h2>

        {/* Name */}
        <form
          action={updateUserName}
          className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
        >
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name || ""}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your name"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Email */}
        <form
          action={updateUserEmail}
          className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
        >
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user.email || ""}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your email"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Password */}
        <div className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black">Password</h3>
              <p className="text-sm text-gray-500">••••••••</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 bg-white/90 hover:bg-gray-50"
            >
              Change
            </Button>
          </div>
        </div>
      </div>

      {/* Other Settings */}
      <div className="mb-6 space-y-3">
        <h2 className="text-lg font-semibold text-black">Preferences</h2>

        {/* Notifications */}
        <div className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-black">Notifications</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 bg-white/90 hover:bg-gray-50"
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-black">Privacy & Security</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 bg-white/90 hover:bg-gray-50"
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Help and Support */}
        <div className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-black">Help and Support</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 bg-white/90 hover:bg-gray-50"
            >
              View
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-black">About</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 bg-white/90 hover:bg-gray-50"
            >
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-8">
        <SignOutButton />
      </div>
    </>
  );
}
