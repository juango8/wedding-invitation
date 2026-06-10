import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { GuestStatus } from '../types/rsvp'

/** Row shape as PostgREST returns it (snake_case, ISO timestamp strings). */
export interface AdminGuest {
  id: string
  token: string
  full_name: string
  phone: string | null
  group_label: string | null
  status: GuestStatus
  message: string | null
  responded_at: string | null
  created_at: string
  updated_at: string
}

export interface GuestInput {
  full_name: string
  phone: string | null
  group_label: string | null
}

/** Admin data layer: direct table access (RLS limits it to admins). Mutations reload the list. */
export function useGuests() {
  const [guests, setGuests] = useState<AdminGuest[] | null>(null)
  const [loadError, setLoadError] = useState(false)

  const refresh = useCallback(async () => {
    if (!supabase) return
    setLoadError(false)
    const { data, error } = await supabase.from('guests').select('*').order('full_name')
    if (error) {
      setLoadError(true)
    } else {
      setGuests((data ?? []) as AdminGuest[])
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addGuest = useCallback(
    async (input: GuestInput): Promise<boolean> => {
      if (!supabase) return false
      const { error } = await supabase.from('guests').insert(input)
      if (error) return false
      await refresh()
      return true
    },
    [refresh],
  )

  const updateGuest = useCallback(
    async (id: string, patch: Partial<GuestInput> & { status?: GuestStatus; responded_at?: string | null }): Promise<boolean> => {
      if (!supabase) return false
      const { error } = await supabase.from('guests').update(patch).eq('id', id)
      if (error) return false
      await refresh()
      return true
    },
    [refresh],
  )

  const deleteGuest = useCallback(
    async (id: string): Promise<boolean> => {
      if (!supabase) return false
      const { error } = await supabase.from('guests').delete().eq('id', id)
      if (error) return false
      await refresh()
      return true
    },
    [refresh],
  )

  /** Manual override for guests who answer via WhatsApp instead of the site. */
  const setStatus = useCallback(
    (id: string, status: GuestStatus) =>
      updateGuest(id, {
        status,
        responded_at: status === 'pending' ? null : new Date().toISOString(),
      }),
    [updateGuest],
  )

  return {
    guests,
    loading: guests === null && !loadError,
    loadError,
    refresh,
    addGuest,
    updateGuest,
    deleteGuest,
    setStatus,
  }
}
