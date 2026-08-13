import { z } from "zod";

export const createLetterSchema = z.object({
  author_name: z
    .string()
    .trim()
    .min(2, "Your name is required.")
    .max(100, "Name is too long."),

  relationship: z
    .string()
    .trim()
    .max(100, "Relationship is too long.")
    .optional(),

  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(2000, "Message is too long."),
});