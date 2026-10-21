import "dotenv/config";
import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url().optional(),
  DATABASE_SSL: booleanFromString.default("true"),
  CORS_ORIGIN: z.string().default("http://localhost:5173")
});

export function getEnv(source = process.env) {
  return schema.parse(source);
}

