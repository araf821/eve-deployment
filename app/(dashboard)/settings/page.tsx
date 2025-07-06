import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, HelpCircle, Info } from "lucide-react";
import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import SignOutButton from "@/components/ui/sign-out-button";
import { PageHeader } from "@/components/layout/PageHeader";
import Image from "next/image";

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
    <div className="">
      {/* Header */}
      <header className="bg-accent px-4 pt-12 pb-8">
        <Image
          src="/logo.svg"
          alt="NiteLite Logo"
          width={64}
          height={64}
          priority
          className="mb-8"
        />
        <PageHeader
          title="Settings"
          subtitle="Manage your account and preferences"
        />
      </header>

      <hr />

      {/* Account Section */}
      <section className="space-y-4 px-4 py-6">
        <h2 className="flex items-center font-heading text-2xl font-bold text-foreground">
          <User className="mr-3 h-6 w-6 text-primary" />
          Account
        </h2>

        {/* Name */}
        <form
          action={updateUserName}
          className="rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Name
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name || ""}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="Enter your name"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Email */}
        <form
          action={updateUserEmail}
          className="rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <div className="flex space-x-2">
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user.email || ""}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              placeholder="Enter your email"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save
            </Button>
          </div>
        </form>

        {/* Password */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Password</h3>
              <p className="text-sm text-muted-foreground">••••••••</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-background hover:bg-accent"
            >
              Change
            </Button>
          </div>
        </div>
      </section>

      <hr />

      {/* Preferences Section */}
      <section className="space-y-4 px-4 py-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Preferences
        </h2>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Notifications</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-background hover:bg-accent"
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                Privacy & Security
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-background hover:bg-accent"
            >
              Manage
            </Button>
          </div>
        </div>

        {/* Help and Support */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                Help and Support
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-background hover:bg-accent"
            >
              View
            </Button>
          </div>
        </div>

        {/* About */}
        <div className="rounded-xl border border-border bg-card/70 p-4 shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">About</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-background hover:bg-accent"
            >
              View
            </Button>
          </div>
        </div>
      </section>

      <hr />

      {/* Sign Out Section */}
      <section className="px-4 py-6">
        <SignOutButton />
      </section>
    </div>
  );
}
