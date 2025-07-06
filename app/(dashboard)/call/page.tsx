// app/(dashboard)/call/page.tsx
import { getCurrentUser } from "@/server/lib/auth";
import BuddyProfile from "@/app/(dashboard)/call/buddyProfileClient";

export default async function CallPage() {
  const user = await getCurrentUser();

  return <BuddyProfile user={user} />;
}
