import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set — fill it in .env (Supabase session pooler, port 5432)')
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Session pooler URI from .env; enforce TLS.
    url: process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=require',
  },
  // RLS policies, RPCs and triggers live in a hand-written migration (db/migrations/*_rls_and_rpcs.sql),
  // so `db:generate` diffs only against tables/enums declared in db/schema.ts.
})
