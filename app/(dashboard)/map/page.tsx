import MapComponent from "@/components/mapComponent";
import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";

export default async function CommunityMapPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <MapComponent />;
}
