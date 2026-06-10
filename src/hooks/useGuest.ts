import { useCallback, useEffect, useState } from 'react'
import { fetchGuest } from '../lib/api'
import { supabase } from '../lib/supabase'
import type { GuestInfo } from '../types/rsvp'

export type GuestState =
  | { kind: 'none' } // no ?g= param (or app built without Supabase env) → personal-invite notice
  | { kind: 'loading' }
  | { kind: 'found'; token: string; guest: GuestInfo }
  | { kind: 'invalid' } // token unknown → "check your link" notice
  | { kind: 'error' } // network failure / timeout → retry + WhatsApp

function readToken(): string | null {
  const raw = new URLSearchParams(window.location.search).get('g')
  const token = raw?.trim()
  return token ? token : null
}

/** Resolves the personal invitation from the ?g= link parameter. */
export function useGuest(): { state: GuestState; retry: () => void } {
  const [token] = useState(readToken)
  const usable = token !== null && supabase !== null
  const [state, setState] = useState<GuestState>(usable ? { kind: 'loading' } : { kind: 'none' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!usable) return
    let cancelled = false
    setState({ kind: 'loading' })
    void fetchGuest(token).then((result) => {
      if (cancelled) return
      setState(result.kind === 'found' ? { kind: 'found', token, guest: result.guest } : result)
    })
    return () => {
      cancelled = true
    }
  }, [token, usable, attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])

  return { state, retry }
}
