import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddBuddyForm } from "@/components/buddies";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AddBuddyPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto max-w-screen-md">
      <header className="mt-12 mb-8">
        <Image
          src="/logo.svg"
          alt="NiteLite Logo"
          width={64}
          height={64}
          priority
          className="mb-8"
        />
        <div className="mb-6">
          <Link href="/buddies" className="mb-6 inline-block">
            <Button
              variant="outline"
              size="sm"
              className="h-10 border-border/50 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Buddies
            </Button>
          </Link>
          <PageHeader
            title="Add Buddy"
            subtitle="Invite a friend to join your safety network"
          />
        </div>
        <div className="mt-6 h-px bg-border"></div>
      </header>
      <main>
        <AddBuddyForm />
      </main>
    </div>
  );
}
