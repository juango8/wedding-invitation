export type GuestStatus = 'pending' | 'accepted' | 'declined'

/** What the public site knows about a guest — the exact shape returned by the get_guest RPC. */
export interface GuestInfo {
  fullName: string
  status: GuestStatus
  message: string | null
}
