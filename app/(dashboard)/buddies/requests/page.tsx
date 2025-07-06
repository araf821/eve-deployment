import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuddyRequestsList } from "@/components/buddies";

export default async function BuddyRequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto max-w-md">
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
        </div>
        <PageHeader
          title="Buddy Requests"
          subtitle="Manage your incoming and outgoing buddy requests"
        />
      </header>

      <hr />

      <section className="px-4 py-6">
        <BuddyRequestsList />
      </section>
    </div>
  );
}
