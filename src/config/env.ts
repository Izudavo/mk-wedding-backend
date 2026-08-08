import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  // Used only by the seed script
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(8),

  CHECK_IN_URL: z.string().url(),
});


export const env = envSchema.parse(process.env);