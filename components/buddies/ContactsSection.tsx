import { ContactCard } from "./ContactCard";
import { Users } from "lucide-react";

const CONTACTS = [
  { name: "Alan" },
  { name: "Naman" },
  { name: "Jerry" },
  { name: "Araf" },
];

export function ContactsSection() {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <Users size={24} className="text-primary" />
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Contacts
        </h2>
      </div>
      <div className="space-y-3">
        {CONTACTS.map((contact, index) => (
          <ContactCard key={index} name={contact.name} />
        ))}
      </div>
    </section>
  );
}
