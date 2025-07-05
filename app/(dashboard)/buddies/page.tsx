import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { BuddiesSection, ContactsSection } from "@/components/buddies";
import Image from "next/image";

export default async function BuddiesPage() {
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
        <PageHeader
          title="Buddies"
          subtitle="Connect with your safety network"
        />
        <div className="mt-6 h-px bg-border"></div>
      </header>
      <main className="space-y-8">
        <BuddiesSection />
        <ContactsSection />
      </main>
    </div>
  );
}
