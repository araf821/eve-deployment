"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addBuddySchema, AddBuddyFormData } from "@/lib/validations/buddy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export function AddBuddyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<AddBuddyFormData>({
    resolver: zodResolver(addBuddySchema),
    defaultValues: {
      email: "",
      nickname: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: AddBuddyFormData) => {
    setIsLoading(true);
    setSubmitError(null); // Clear any previous errors

    try {
      const response = await fetch("/api/buddies/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || "Failed to send buddy request";
        setSubmitError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success("Buddy request sent successfully!");
      router.push("/buddies");
    } catch (error) {
      console.error("Add buddy error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send buddy request";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <UserPlus size={24} className="text-primary" />
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Add New Buddy
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your friend's email"
            {...form.register("email")}
            className="h-12"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="What should we call them?"
            {...form.register("nickname")}
            className="h-12"
          />
          {form.formState.errors.nickname && (
            <p className="text-sm text-red-500">
              {form.formState.errors.nickname.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter their phone number"
            {...form.register("phoneNumber")}
            className="h-12"
          />
          {form.formState.errors.phoneNumber && (
            <p className="text-sm text-red-500">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
        </div>

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <p className="text-sm font-medium text-red-800">{submitError}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-12 flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="h-12 flex-1">
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="how-it-works">
            <AccordionTrigger className="text-left">
              How does the buddy system work?
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  When you send a buddy request, we&apos;ll notify your friend
                  via email. Once they accept, you&apos;ll both be connected in
                  your safety network.
                </p>
                <p>
                  <strong>What you can do together:</strong>
                </p>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Track each other&apos;s location during walks</li>
                  <li>Receive automatic check-ins and safety alerts</li>
                  <li>Quickly call each other in case of emergencies</li>
                  <li>Share your planned routes and destinations</li>
                </ul>
                <p>
                  Your buddy will be able to see your real-time location only
                  when you start a guided walk, ensuring your privacy is always
                  protected.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </section>
  );
}
