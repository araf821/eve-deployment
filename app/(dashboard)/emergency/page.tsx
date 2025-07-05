import { Phone, MapPin, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, LogoCompact } from "@/components/logo";

export default function EmergencyPage() {
  return (
    <div className="relative space-y-6 md:space-y-12">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-tr from-accent/20 to-primary/30 blur-3xl" />
      </div>

      {/* Header */}
      <div className="space-y-3 md:space-y-4">
        <LogoCompact className="md:hidden" />
        <Logo className="hidden md:block" />
        <div className="space-y-1 md:space-y-2">
          <h1 className="font-heading text-xl font-bold text-foreground md:text-2xl">
            Emergency Help
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Quick access to emergency features and contacts
          </p>
        </div>
      </div>

      {/* Emergency SOS Button */}
      <div className="space-y-3 md:space-y-4">
        <h2 className="font-heading text-base font-semibold text-foreground md:text-lg">
          Emergency SOS
        </h2>
        <p className="text-xs text-muted-foreground md:text-sm">
          Send immediate alert to your emergency contacts
        </p>
        <Button
          size="lg"
          className="text-destructive-foreground h-14 w-full bg-destructive text-base font-semibold hover:bg-destructive/90 md:h-16 md:text-lg"
        >
          <AlertTriangle className="mr-2 h-5 w-5 md:mr-3 md:h-6 md:w-6" />
          Send Emergency Alert
        </Button>
      </div>

      {/* Emergency Contacts */}
      <div className="space-y-4 md:space-y-6">
        <h2 className="font-heading text-base font-semibold text-foreground md:text-lg">
          Emergency Contacts
        </h2>
        <div className="space-y-2 md:space-y-3">
          <Button
            variant="ghost"
            className="h-12 w-full justify-start bg-secondary text-foreground hover:bg-secondary/80 md:h-14"
          >
            <Phone className="mr-3 h-4 w-4 text-muted-foreground md:mr-4 md:h-5 md:w-5" />
            <div className="text-left">
              <div className="text-sm font-medium md:text-base">
                Campus Security
              </div>
              <div className="text-xs text-muted-foreground md:text-sm">
                (555) 123-4567
              </div>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="h-12 w-full justify-start bg-secondary text-foreground hover:bg-secondary/80 md:h-14"
          >
            <Phone className="mr-3 h-4 w-4 text-muted-foreground md:mr-4 md:h-5 md:w-5" />
            <div className="text-left">
              <div className="text-sm font-medium md:text-base">
                Local Police
              </div>
              <div className="text-xs text-muted-foreground md:text-sm">
                911
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Share Location */}
      <div className="space-y-4 md:space-y-6">
        <h2 className="font-heading text-base font-semibold text-foreground md:text-lg">
          Share Location
        </h2>
        <Button
          variant="ghost"
          className="h-12 w-full justify-start bg-secondary text-foreground hover:bg-secondary/80 md:h-14"
        >
          <MapPin className="mr-3 h-4 w-4 text-muted-foreground md:mr-4 md:h-5 md:w-5" />
          <div className="text-left">
            <div className="text-sm font-medium md:text-base">
              Send Current Location
            </div>
            <div className="text-xs text-muted-foreground md:text-sm">
              Share with emergency contacts
            </div>
          </div>
        </Button>
      </div>

      {/* Alert Buddies */}
      <div className="space-y-4 md:space-y-6">
        <h2 className="font-heading text-base font-semibold text-foreground md:text-lg">
          Alert Buddies
        </h2>
        <Button
          variant="ghost"
          className="h-12 w-full justify-start bg-secondary text-foreground hover:bg-secondary/80 md:h-14"
        >
          <Users className="mr-3 h-4 w-4 text-muted-foreground md:mr-4 md:h-5 md:w-5" />
          <div className="text-left">
            <div className="text-sm font-medium md:text-base">
              Notify All Buddies
            </div>
            <div className="text-xs text-muted-foreground md:text-sm">
              Send alert to your crew
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
