import MapComponent from "@/components/MapComponent";
import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";

export default async function CommunityMapPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <MapComponent userId={user.id} />;
}
