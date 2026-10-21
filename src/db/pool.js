import pg from "pg";
import { getEnv } from "../config/env.js";

const { Pool } = pg;
const env = getEnv();

if (!env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL. Copia .env.example a .env y configura la conexion de Supabase.");
}

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000
});

