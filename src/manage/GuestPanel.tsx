import { useMemo, useState } from 'react'
import type { GuestStatus } from '../types/rsvp'
import { GuestFormModal } from './GuestFormModal'
import { groupMessage, inviteLink, inviteMessage, waSendUrl } from './messages'
import { useGuests, type AdminGuest } from './useGuests'

// ---------- helpers ----------

const STATUS_LABEL: Record<GuestStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Confirmado',
  declined: 'No asistirá',
}

const STATUS_RANK: Record<GuestStatus, number> = { accepted: 0, declined: 1, pending: 2 }

const STATUS_CLASS: Record<GuestStatus, string> = {
  pending: 'text-warm-muted border-warm-muted/40 bg-white',
  accepted: 'text-white border-rose-dark bg-rose-dark',
  declined: 'text-rose border-rose/50 bg-rose/5',
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const limaFmt = new Intl.DateTimeFormat('es-PE', {
  timeZone: 'America/Lima',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
const fmtLima = (iso: string | null) => (iso ? limaFmt.format(new Date(iso)) : '—')

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ---------- small components ----------

function CopyButton({ getText, title, children }: { getText: () => string; title: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      title={copied ? '¡Copiado!' : title}
      aria-label={title}
      onClick={async () => {
        if (await copyText(getText())) {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }
      }}
      className={`p-1.5 transition-colors ${copied ? 'text-rose-dark' : 'text-warm-muted hover:text-rose'}`}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}

const LinkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" d="M13.5 10.5L21 3m-5 0h5v5M10.5 13.5L3 21m5 0H3v-5" />
  </svg>
)

const MessageIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8m-8 4h5m-9 7V6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4z" />
  </svg>
)

const WaIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

function StatusSelect({ guest, onChange }: { guest: AdminGuest; onChange: (s: GuestStatus) => void }) {
  return (
    <select
      value={guest.status}
      onChange={(e) => onChange(e.target.value as GuestStatus)}
      title="Cambiar estado manualmente (p. ej. respuestas por WhatsApp)"
      className={`border px-2 py-1 font-sans text-[11px] uppercase tracking-wider cursor-pointer focus:outline-none ${STATUS_CLASS[guest.status]}`}
    >
      <option value="pending">Pendiente</option>
      <option value="accepted">Confirmado</option>
      <option value="declined">No asistirá</option>
    </select>
  )
}

function RowActions({ guest, onEdit, onDelete }: { guest: AdminGuest; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-0.5">
      <CopyButton getText={() => inviteLink(guest.token)} title="Copiar enlace">
        {LinkIcon}
      </CopyButton>
      <CopyButton getText={() => inviteMessage(guest.full_name, guest.token)} title="Copiar mensaje personalizado">
        {MessageIcon}
      </CopyButton>
      {guest.phone && (
        <a
          href={waSendUrl(guest.phone, inviteMessage(guest.full_name, guest.token))}
          target="_blank"
          rel="noopener noreferrer"
          title="Enviar por WhatsApp"
          className="p-1.5 text-warm-muted hover:text-rose-dark transition-colors"
        >
          {WaIcon}
        </a>
      )}
      <button
        type="button"
        onClick={onEdit}
        title="Editar"
        className="p-1.5 text-warm-muted hover:text-rose transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.86 4.49a1.9 1.9 0 112.69 2.69L7.5 19.23l-3.61.92.92-3.61L16.86 4.49z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Eliminar"
        className="p-1.5 text-warm-muted hover:text-rose transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0l.7 12.1a1 1 0 001 .9h4.6a1 1 0 001-.9L17 7" />
        </svg>
      </button>
    </div>
  )
}

// ---------- main panel ----------

type SortKey = 'name' | 'status' | 'responded'

export function GuestPanel() {
  const { guests, loading, loadError, refresh, addGuest, updateGuest, deleteGuest, setStatus } = useGuests()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | GuestStatus>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'name', dir: 1 })
  const [form, setForm] = useState<{ open: boolean; guest: AdminGuest | null }>({ open: false, guest: null })
  const [deleting, setDeleting] = useState<AdminGuest | null>(null)
  const [actionError, setActionError] = useState(false)

  const groups = useMemo(() => {
    const set = new Set<string>()
    for (const g of guests ?? []) if (g.group_label) set.add(g.group_label)
    return [...set].sort((a, b) => a.localeCompare(b, 'es'))
  }, [guests])

  const filtered = useMemo(() => {
    let list = guests ?? []
    if (search.trim()) {
      const q = norm(search.trim())
      list = list.filter((g) => norm(g.full_name).includes(q) || (g.group_label && norm(g.group_label).includes(q)))
    }
    if (statusFilter !== 'all') list = list.filter((g) => g.status === statusFilter)
    if (groupFilter === '__none__') list = list.filter((g) => !g.group_label)
    else if (groupFilter !== 'all') list = list.filter((g) => g.group_label === groupFilter)

    const cmp = (a: AdminGuest, b: AdminGuest): number => {
      switch (sort.key) {
        case 'name':
          return norm(a.full_name).localeCompare(norm(b.full_name), 'es')
        case 'status':
          return STATUS_RANK[a.status] - STATUS_RANK[b.status] || norm(a.full_name).localeCompare(norm(b.full_name), 'es')
        case 'responded': {
          const ta = a.responded_at ? Date.parse(a.responded_at) : -Infinity
          const tb = b.responded_at ? Date.parse(b.responded_at) : -Infinity
          return tb - ta // recent first
        }
      }
    }
    return [...list].sort((a, b) => cmp(a, b) * sort.dir)
  }, [guests, search, statusFilter, groupFilter, sort])

  const stats = useMemo(() => {
    const all = guests ?? []
    const by = (s: GuestStatus) => all.filter((g) => g.status === s).length
    return { total: all.length, accepted: by('accepted'), declined: by('declined'), pending: by('pending') }
  }, [guests])

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))

  const sortArrow = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : '')

  const handleSave = async (input: Parameters<typeof addGuest>[0]) => {
    const ok = form.guest ? await updateGuest(form.guest.id, input) : await addGuest(input)
    setActionError(!ok)
    return ok
  }

  const handleDelete = async () => {
    if (!deleting) return
    const ok = await deleteGuest(deleting.id)
    setActionError(!ok)
    setDeleting(null)
  }

  const handleStatus = async (id: string, s: GuestStatus) => {
    const ok = await setStatus(id, s)
    setActionError(!ok)
  }

  const exportCsv = () => {
    const esc = (v: string | null) => `"${(v ?? '').replace(/"/g, '""')}"`
    const rows = (guests ?? []).map((g) =>
      [
        esc(g.full_name),
        esc(g.phone),
        esc(g.group_label),
        esc(STATUS_LABEL[g.status]),
        esc(g.message),
        esc(g.responded_at ? fmtLima(g.responded_at) : ''),
        esc(inviteLink(g.token)),
      ].join(','),
    )
    const csv = '﻿' + ['Nombre,WhatsApp,Grupo,Estado,Mensaje,Respondió,Enlace', ...rows].join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `invitados-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const groupGuests = groupFilter !== 'all' && groupFilter !== '__none__' ? filtered : []

  if (loading) {
    return <p className="text-center font-sans text-sm text-warm-muted animate-pulse py-16">Cargando invitados…</p>
  }

  if (loadError) {
    return (
      <div className="bg-white border border-rose/30 p-8 text-center space-y-4">
        <p className="font-sans text-sm text-rose">No se pudo cargar la lista de invitados.</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="bg-rose border border-rose text-white font-sans text-[11px] uppercase tracking-widest px-6 py-2.5 hover:bg-rose-dark transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(
          [
            ['Invitados', stats.total, 'text-warm-text'],
            ['Confirmados', stats.accepted, 'text-rose-dark'],
            ['No asistirán', stats.declined, 'text-rose'],
            ['Pendientes', stats.pending, 'text-warm-muted'],
          ] as const
        ).map(([label, value, color]) => (
          <div key={label} className="bg-white border border-rose-blush/50 px-4 py-5 text-center">
            <p className={`font-serif text-3xl ${color}`}>{value}</p>
            <p className="font-sans text-[11px] uppercase tracking-widest text-warm-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-rose-blush/50 p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o grupo…"
            className="flex-1 min-w-[180px] border border-rose-blush/60 px-3 py-2 font-sans text-sm text-warm-text focus:outline-none focus:border-rose transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | GuestStatus)}
            className="border border-rose-blush/60 px-2 py-2 font-sans text-xs text-warm-text bg-white focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="accepted">Confirmados</option>
            <option value="declined">No asistirán</option>
          </select>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="border border-rose-blush/60 px-2 py-2 font-sans text-xs text-warm-text bg-white focus:outline-none"
          >
            <option value="all">Todos los grupos</option>
            <option value="__none__">Sin grupo</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ open: true, guest: null })}
            className="bg-rose border border-rose text-white font-sans text-[11px] uppercase tracking-widest px-5 py-2.5 hover:bg-rose-dark hover:border-rose-dark transition-colors"
          >
            + Agregar invitado
          </button>
          {groupGuests.length > 0 && (
            <CopyButton getText={() => groupMessage(groupGuests)} title={`Copiar mensaje del grupo (${groupGuests.length} enlaces)`}>
              <span className="font-sans text-[11px] uppercase tracking-widest underline underline-offset-4">
                Copiar mensaje del grupo
              </span>
            </CopyButton>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => void refresh()}
            className="font-sans text-[11px] uppercase tracking-widest text-warm-muted underline underline-offset-4 hover:text-rose transition-colors"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="font-sans text-[11px] uppercase tracking-widest text-warm-muted underline underline-offset-4 hover:text-rose transition-colors"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {actionError && (
        <p className="font-sans text-xs text-rose bg-rose/5 border border-rose/30 px-4 py-3">
          La última acción no se pudo completar. Revisa tu conexión e inténtalo de nuevo.
        </p>
      )}

      {/* Empty states */}
      {filtered.length === 0 && (
        <div className="bg-white border border-rose-blush/50 p-10 text-center">
          <p className="font-sans text-sm text-warm-muted">
            {stats.total === 0
              ? 'Aún no hay invitados. Usa "Agregar invitado" para crear el primero.'
              : 'Sin resultados con los filtros actuales.'}
          </p>
        </div>
      )}

      {/* Desktop table */}
      {filtered.length > 0 && (
        <div className="hidden md:block bg-white border border-rose-blush/50 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-rose-blush/40">
                <th
                  onClick={() => toggleSort('name')}
                  className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-warm-muted cursor-pointer select-none"
                >
                  Nombre{sortArrow('name')}
                </th>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-warm-muted">Grupo</th>
                <th
                  onClick={() => toggleSort('status')}
                  className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-warm-muted cursor-pointer select-none"
                >
                  Estado{sortArrow('status')}
                </th>
                <th
                  onClick={() => toggleSort('responded')}
                  className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-warm-muted cursor-pointer select-none"
                >
                  Respondió{sortArrow('responded')}
                </th>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-warm-muted">Mensaje</th>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-widest text-warm-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-rose-blush/20 last:border-0">
                  <td className="px-4 py-3 font-sans text-sm text-warm-text">{g.full_name}</td>
                  <td className="px-4 py-3 font-sans text-xs text-warm-muted">{g.group_label ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusSelect guest={g} onChange={(s) => void handleStatus(g.id, s)} />
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-warm-muted whitespace-nowrap">{fmtLima(g.responded_at)}</td>
                  <td className="px-4 py-3 font-sans text-xs text-warm-muted max-w-[220px]">
                    <span className="block truncate" title={g.message ?? ''}>
                      {g.message ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      guest={g}
                      onEdit={() => setForm({ open: true, guest: g })}
                      onDelete={() => setDeleting(g)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {filtered.length > 0 && (
        <div className="md:hidden space-y-3">
          {filtered.map((g) => (
            <div key={g.id} className="bg-white border border-rose-blush/50 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-sans text-sm text-warm-text">{g.full_name}</p>
                  {g.group_label && <p className="font-sans text-[11px] text-warm-muted mt-0.5">{g.group_label}</p>}
                </div>
                <StatusSelect guest={g} onChange={(s) => void handleStatus(g.id, s)} />
              </div>
              {g.message && <p className="font-serif italic text-xs text-warm-muted">“{g.message}”</p>}
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] text-warm-muted">{fmtLima(g.responded_at)}</span>
                <RowActions
                  guest={g}
                  onEdit={() => setForm({ open: true, guest: g })}
                  onDelete={() => setDeleting(g)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="font-sans text-[11px] text-warm-muted text-center">
          Mostrando {filtered.length} de {stats.total} invitados
        </p>
      )}

      {/* Modals */}
      {form.open && (
        <GuestFormModal initial={form.guest} onSave={handleSave} onClose={() => setForm({ open: false, guest: null })} />
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleting(null)
          }}
        >
          <div className="bg-white border border-rose-blush/50 p-6 w-full max-w-sm space-y-4 text-center">
            <p className="font-serif text-xl text-warm-text">¿Eliminar a {deleting.full_name}?</p>
            <p className="font-sans text-xs text-warm-muted leading-relaxed">
              Su enlace de invitación dejará de funcionar de inmediato
              {deleting.status !== 'pending' && ' y se perderá su respuesta registrada'}.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="flex-1 border border-rose-blush/60 text-warm-muted font-sans text-[11px] uppercase tracking-widest py-2.5 hover:border-rose hover:text-rose transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                className="flex-1 bg-rose border border-rose text-white font-sans text-[11px] uppercase tracking-widest py-2.5 hover:bg-rose-dark hover:border-rose-dark transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
