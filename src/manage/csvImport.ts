// Browser-side CSV import for the manage panel — same rules as scripts/import-guests.mjs:
// flexible Spanish/English headers (only a name column is required), free-text status
// values mapped to accepted/declined, match-by-normalized-name, and never downgrading
// an answer already registered through the site.
import type { GuestStatus } from '../types/rsvp'
import type { AdminGuest } from './useGuests'

export interface ImportInsert {
  full_name: string
  phone: string | null
  group_label: string | null
  status: GuestStatus
  message: string | null
  responded_at: string | null
}

export interface ImportUpdate {
  id: string
  full_name: string
  patch: Partial<{
    phone: string
    group_label: string
    message: string
    status: GuestStatus
    responded_at: string
  }>
}

export interface ImportPlan {
  inserts: ImportInsert[]
  updates: ImportUpdate[]
  unchanged: number
  skipped: number
}

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

/** For guest names: accent-insensitive, lowercase. */
const norm = (s: string) => stripAccents(String(s ?? '')).toLowerCase().trim()

/** For CSV headers: additionally drop punctuation ("¿Asistirás?" -> "asistiras"). */
const normHeader = (s: string) => norm(s).replace(/[^a-z0-9 _]/g, '').trim()

// Minimal RFC4180 parser (quotes, escaped quotes, CRLF). Returns array of rows.
function parseCsv(text: string): string[][] {
  const src = text.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(field)
      if (row.some((f) => f.trim() !== '')) rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  row.push(field)
  if (row.some((f) => f.trim() !== '')) rows.push(row)
  return rows
}

const HEADER_ALIASES: Record<string, string[]> = {
  full_name: ['nombre', 'nombre completo', 'name', 'full name', 'full_name', 'invitado'],
  phone: ['telefono', 'whatsapp', 'celular', 'phone', 'numero', 'tel'],
  group_label: ['grupo', 'group', 'familia'],
  status: ['estado', 'status', 'asistencia', 'asistira', 'asistiras', 'respuesta', 'attending', 'confirmacion'],
  message: ['mensaje', 'message', 'comentario', 'notas', 'mensaje para los novios'],
}

function mapStatus(raw: string): GuestStatus {
  const v = norm(raw)
  if (!v) return 'pending'
  if (/(pena|no podr|no asist|no ire|no voy|declin|rechaz)/.test(v) || v === 'no') return 'declined'
  if (/(gusto|acept|confirm|asist|si|yes)/.test(v)) return 'accepted'
  return 'pending'
}

function mapPhone(raw: string): string | null {
  const d = String(raw ?? '').replace(/\D/g, '')
  if (!d) return null
  // Peruvian mobiles are 9 digits starting with 9 — add the country code if missing.
  return /^9\d{8}$/.test(d) ? '51' + d : d
}

export function buildImportPlan(
  text: string,
  existing: AdminGuest[],
): { plan: ImportPlan; error?: undefined } | { plan?: undefined; error: string } {
  const rows = parseCsv(text)
  if (rows.length < 2) return { error: 'El CSV no tiene filas de datos.' }

  const header = rows[0].map(normHeader)
  const idx: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {}
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const i = header.findIndex((h) => aliases.includes(h))
    if (i !== -1) idx[field] = i
  }
  if (idx.full_name === undefined) {
    return { error: `No se encontró la columna de nombre. Encabezados detectados: ${rows[0].join(' | ')}` }
  }

  const byName = new Map<string, Pick<AdminGuest, 'id' | 'phone' | 'group_label' | 'status' | 'message'>>(
    existing.map((g) => [norm(g.full_name), g]),
  )
  const plan: ImportPlan = { inserts: [], updates: [], unchanged: 0, skipped: 0 }

  for (const row of rows.slice(1)) {
    const name = String(row[idx.full_name] ?? '').trim()
    if (!name) {
      plan.skipped++
      continue
    }
    const phone = idx.phone !== undefined ? mapPhone(row[idx.phone]) : null
    const group = idx.group_label !== undefined ? String(row[idx.group_label] ?? '').trim() || null : null
    const status = idx.status !== undefined ? mapStatus(row[idx.status]) : 'pending'
    const message = idx.message !== undefined ? String(row[idx.message] ?? '').trim().slice(0, 500) || null : null

    const ex = byName.get(norm(name))
    if (!ex) {
      plan.inserts.push({
        full_name: name,
        phone,
        group_label: group,
        status,
        message,
        responded_at: status !== 'pending' ? new Date().toISOString() : null,
      })
      byName.set(norm(name), { id: 'new', phone, group_label: group, status, message })
      continue
    }

    const patch: ImportUpdate['patch'] = {}
    if (phone && phone !== ex.phone) patch.phone = phone
    if (group && group !== ex.group_label) patch.group_label = group
    if (message && !ex.message) patch.message = message
    // Never downgrade an answer already registered through the site.
    if (status !== 'pending' && ex.status === 'pending') {
      patch.status = status
      patch.responded_at = new Date().toISOString()
    }
    if (Object.keys(patch).length === 0) plan.unchanged++
    else if (ex.id === 'new') plan.unchanged++ // duplicate row inside the same file
    else plan.updates.push({ id: ex.id, full_name: name, patch })
  }

  return { plan }
}
