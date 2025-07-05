import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface BuddyCardProps {
  name: string;
  description: string;
  href?: string;
}

export function BuddyCard({
  name,
  description,
  href = "/call",
}: BuddyCardProps) {
  return (
    <Link href={href} className="block">
      <div className="flex cursor-pointer items-center justify-between rounded-xl bg-card p-6 shadow-sm backdrop-blur-sm transition-all hover:bg-card/90 hover:shadow-md">
        <div className="flex flex-col space-y-1">
          <span className="font-heading text-lg font-semibold text-foreground">
            {name}
          </span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full hover:bg-accent"
        >
          <Phone size={20} className="text-primary" />
        </Button>
      </div>
    </Link>
  );
}
