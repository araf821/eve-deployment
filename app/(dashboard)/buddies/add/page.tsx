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
    <div>
      <header className="bg-accent/50 px-4 pt-12 pb-8">
        <div className="flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="NiteLite Logo"
            width={64}
            height={64}
            priority
            className="mb-8"
          />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-10 border-border/50 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Link href="/buddies" className="mb-6 inline-block">
              <ArrowLeft size={16} className="mr-2" />
              Back to Buddies
            </Link>
          </Button>
        </div>
        <PageHeader
          title="Add Buddy"
          subtitle="Invite a friend to join your safety network"
        />
      </header>

      <hr />

      <AddBuddyForm />
    </div>
  );
}
