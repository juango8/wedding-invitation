import { supabase } from './supabase'
import type { GuestInfo, GuestStatus } from '../types/rsvp'

const RPC_TIMEOUT_MS = 8000

type GetGuestRow = { full_name: string; status: GuestStatus; message: string | null }

export type GuestLookup =
  | { kind: 'found'; guest: GuestInfo }
  | { kind: 'invalid' } // token unknown — distinct from a network failure
  | { kind: 'error' }

export async function fetchGuest(token: string): Promise<GuestLookup> {
  if (!supabase) return { kind: 'error' }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS)
  try {
    const { data, error } = await supabase
      .rpc('get_guest', { p_token: token })
      .abortSignal(controller.signal)
    if (error) return { kind: 'error' }
    const rows = (data ?? []) as GetGuestRow[]
    if (rows.length === 0) return { kind: 'invalid' }
    const row = rows[0]
    return {
      kind: 'found',
      guest: { fullName: row.full_name, status: row.status, message: row.message },
    }
  } catch {
    return { kind: 'error' }
  } finally {
    clearTimeout(timer)
  }
}

export type SubmitResult = 'ok' | 'not_found' | 'error'

export async function submitRsvp(
  token: string,
  attending: boolean,
  message: string,
): Promise<SubmitResult> {
  if (!supabase) return 'error'
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS)
  try {
    const { data, error } = await supabase
      .rpc('submit_rsvp', {
        p_token: token,
        p_attending: attending,
        p_message: message.trim() || null,
      })
      .abortSignal(controller.signal)
    if (error) return 'error'
    // The RPC returns false when no row matched the token (guest deleted meanwhile).
    return data === true ? 'ok' : 'not_found'
  } catch {
    return 'error'
  } finally {
    clearTimeout(timer)
  }
}
