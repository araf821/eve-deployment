import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  BuddiesPageHeader,
  BuddiesSection,
  ContactsSection,
} from "@/components/buddies";
import Image from "next/image";

export default async function BuddiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="">
      <header className="bg-accent/50 px-4 pt-12 pb-8">
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
        <BuddiesPageHeader />
      </header>

      <hr />

      <BuddiesSection />

      <hr />

      <ContactsSection />
    </div>
  );
}
