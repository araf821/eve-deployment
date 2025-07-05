import { z } from "zod";

export const addBuddySchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  nickname: z
    .string()
    .trim()
    .min(1, "Nickname is required")
    .max(50, "Nickname must be less than 50 characters"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
});

export const buddyRequestActionSchema = z.object({
  action: z.enum(["accept", "reject"]),
});

export type AddBuddyFormData = z.infer<typeof addBuddySchema>;
export type BuddyRequestActionData = z.infer<typeof buddyRequestActionSchema>;
