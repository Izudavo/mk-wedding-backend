import { z } from "zod";

export const validateAccessCodeSchema = z.object({
  code: z.string().trim().min(1, "Access code is required."),
});

export const createRsvpSchema = z.object({
  code: z.string().trim().min(1, "Access code is required."),

  full_name: z.string().trim().min(2, "Full name is required."),

  phone_number: z.string().trim().min(7, "Phone number is required."),

  email: z.string().email("Invalid email.").optional(),

  has_plus_one: z.boolean().default(false),

  plus_one_name: z.string().trim().optional(),
});

export const searchRsvpSchema = z.object({
  query: z.string().trim().min(2, "Search query is required."),
});
