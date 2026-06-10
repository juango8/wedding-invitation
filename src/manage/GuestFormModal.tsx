import { useState } from 'react'
import type { AdminGuest, GuestInput } from './useGuests'

const inputClass =
  'w-full border border-rose-blush/60 px-3 py-2.5 font-sans text-sm text-warm-text bg-white focus:outline-none focus:border-rose transition-colors'

export function GuestFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial: AdminGuest | null
  onSave: (input: GuestInput) => Promise<boolean>
  onClose: () => void
}) {
  const [name, setName] = useState(initial?.full_name ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [group, setGroup] = useState(initial?.group_label ?? '')
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fullName = name.trim()
    if (!fullName) return
    setSaving(true)
    setFailed(false)
    const ok = await onSave({
      full_name: fullName,
      phone: phone.replace(/\D/g, '') || null,
      group_label: group.trim() || null,
    })
    setSaving(false)
    if (ok) onClose()
    else setFailed(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white border border-rose-blush/50 p-6 w-full max-w-sm space-y-4">
        <p className="font-serif text-xl text-warm-text">
          {initial ? 'Editar invitado' : 'Nuevo invitado'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="g-name" className="block font-sans text-[11px] uppercase tracking-widest text-warm-muted mb-1.5">
              Nombre completo *
            </label>
            <input
              id="g-name"
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="María Pérez"
            />
          </div>
          <div>
            <label htmlFor="g-phone" className="block font-sans text-[11px] uppercase tracking-widest text-warm-muted mb-1.5">
              WhatsApp <span className="normal-case text-warm-muted/60">(opcional, con código de país)</span>
            </label>
            <input
              id="g-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="51987654321"
            />
          </div>
          <div>
            <label htmlFor="g-group" className="block font-sans text-[11px] uppercase tracking-widest text-warm-muted mb-1.5">
              Grupo <span className="normal-case text-warm-muted/60">(opcional, ej. "Familia Pérez")</span>
            </label>
            <input
              id="g-group"
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className={inputClass}
              placeholder="Familia Pérez"
            />
          </div>

          {failed && (
            <p className="font-sans text-xs text-rose">No se pudo guardar. Inténtalo de nuevo.</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-rose-blush/60 text-warm-muted font-sans text-[11px] uppercase tracking-widest py-2.5 hover:border-rose hover:text-rose transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 bg-rose border border-rose text-white font-sans text-[11px] uppercase tracking-widest py-2.5 hover:bg-rose-dark hover:border-rose-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
