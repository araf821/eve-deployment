import { getCurrentUser } from "@/server/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BuddiesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const aiBuddies = [
    { name: "Ev", description: "(female voice)" },
    { name: "Adam", description: "(male voice)" }
  ];

  const contacts = [
    { name: "Alan" },
    { name: "Naman" },
    { name: "Jerry" },
    { name: "Araf" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-black mb-2">
          <img src="logo.svg" alt="Logo" />
        </div>
      </div>

      {/* Buddies Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-4">Buddies</h2>
        
        {/* AI Buddies Subsection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">AI Buddies</h3>
          <div className="space-y-3">
            {aiBuddies.map((buddy, index) => (
              <Link href="/call" key={index}>
                <div className="flex items-center my-3 justify-between bg-white backdrop-blur-sm rounded-lg p-4 shadow-sm hover:bg-white/90 transition-colors cursor-pointer">
                  <div className="flex flex-col">
                    <span className="font-medium text-black">{buddy.name}</span>
                    <span className="text-sm text-gray-600">{buddy.description}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <img 
                      src="/call.svg" 
                      alt="Call" 
                      className="h-5 w-5"
                    />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Contacts</h2>
        <div className="space-y-5">
          {contacts.map((contact, index) => (
            <Link href="/call" key={index}>
              <div className="flex items-center justify-between my-3 bg-white backdrop-blur-sm rounded-lg p-4 shadow-sm hover:bg-white/90 transition-colors cursor-pointer">
                <span className="font-medium text-black">{contact.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <img 
                    src="/call.svg" 
                    alt="Call" 
                    className="h-5 w-5"
                  />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}