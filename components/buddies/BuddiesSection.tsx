import { BuddyCard } from "./BuddyCard";
import { Bot } from "lucide-react";

const AI_BUDDIES = [
  { name: "Ev", description: "Female voice assistant" },
  { name: "Adam", description: "Male voice assistant" },
];

export function BuddiesSection() {
  return (
    <section className="mb-8">
      <div className="mb-6 flex items-center gap-3">
        <Bot size={24} className="text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">
          AI Buddies
        </h2>
      </div>
      <div className="space-y-3">
        {AI_BUDDIES.map((buddy, index) => (
          <BuddyCard
            key={index}
            name={buddy.name}
            description={buddy.description}
          />
        ))}
      </div>
    </section>
  );
}
