import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Single Supabase client for the whole app. `null` when the env vars are missing
 * (e.g. a build without secrets) — callers must degrade gracefully instead of crashing,
 * mirroring how VenueMap handles a missing Maps key.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          // PKCE returns the OAuth callback as ?code=, which coexists with hash-based
          // routing on GitHub Pages (see docs/RESTRUCTURE_PLAN.md).
          flowType: 'pkce',
        },
      })
    : null
