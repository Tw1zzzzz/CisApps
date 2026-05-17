import "dotenv/config";
import { z } from "zod";

const LOCAL_OTP_SECRET = "local-development-secret";

const envSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().optional(),
  OTP_SECRET: z.string().min(12).default(LOCAL_OTP_SECRET)
});

const parsed = envSchema.parse(process.env);

if (parsed.APP_ENV !== "test" && !parsed.DATABASE_URL) {
  throw new Error("DATABASE_URL is required outside APP_ENV=test.");
}

if (parsed.APP_ENV === "production" && parsed.OTP_SECRET === LOCAL_OTP_SECRET) {
  throw new Error("OTP_SECRET must be configured in production.");
}

export const env = parsed;
