import { z } from "zod";

export const generateAccessCodesSchema = z.object({
  quantity: z
    .number()
    .int()
    .min(1)
    .max(400), //cap for code generation
});