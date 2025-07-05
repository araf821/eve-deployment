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
          <Link href="/buddies">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              <ArrowLeft size={16} className="mr-2" />
              Back to Buddies
            </Button>
          </Link>
          <PageHeader
            title="Buddy Requests"
            subtitle="Manage your incoming buddy requests"
          />
        </div>
        <div className="mt-6 h-px bg-border"></div>
      </header>
      <main>
        <BuddyRequestsList />
      </main>
    </div>
  );
}
