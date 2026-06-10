import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type AdminState =
  | { kind: 'no_backend' } // app built without Supabase env vars
  | { kind: 'loading' }
  | { kind: 'signed_out' }
  | { kind: 'unauthorized'; email: string }
  | { kind: 'admin'; email: string }

const POST_LOGIN_KEY = 'postLoginRoute'

/** Marks that the OAuth round trip should land on #/manage (backup in case the
 *  provider drops the fragment from redirectTo). Consumed once in App. */
export function consumePostLoginRedirect(): boolean {
  if (sessionStorage.getItem(POST_LOGIN_KEY) !== 'manage') return false
  sessionStorage.removeItem(POST_LOGIN_KEY)
  return true
}

export function useAdminSession(): {
  state: AdminState
  signIn: () => Promise<void>
  signOut: () => Promise<void>
} {
  // undefined = still restoring from storage / exchanging the OAuth code
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [adminCheck, setAdminCheck] = useState<{ email: string; isAdmin: boolean } | null>(null)

  useEffect(() => {
    if (!supabase) return
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      // No supabase calls inside this callback (auth-lock deadlock) — only state.
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  const email = session?.user?.email ?? null

  useEffect(() => {
    if (!supabase || !email) {
      setAdminCheck(null)
      return
    }
    const sb = supabase
    let cancelled = false
    void sb.rpc('is_admin').then(({ data, error }) => {
      if (!cancelled) setAdminCheck({ email, isAdmin: !error && data === true })
    })
    return () => {
      cancelled = true
    }
  }, [email])

  const signIn = useCallback(async () => {
    if (!supabase) return
    sessionStorage.setItem(POST_LOGIN_KEY, 'manage')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}#/manage`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  let state: AdminState
  if (!supabase) state = { kind: 'no_backend' }
  else if (session === undefined) state = { kind: 'loading' }
  else if (session === null || !email) state = { kind: 'signed_out' }
  else if (!adminCheck || adminCheck.email !== email) state = { kind: 'loading' }
  else if (adminCheck.isAdmin) state = { kind: 'admin', email }
  else state = { kind: 'unauthorized', email }

  return { state, signIn, signOut }
}
