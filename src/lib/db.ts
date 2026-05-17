import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

type DbClient = ReturnType<typeof drizzle>;

let cachedDb: DbClient | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  if (!cachedDb) {
    cachedDb = drizzle(neon(databaseUrl));
  }

  return cachedDb;
}

export function databaseMode() {
  return process.env.DATABASE_URL ? "database" : "demo";
}
