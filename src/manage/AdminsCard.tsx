import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/** Allowlist management: any admin can add another; removing yourself is blocked (also in RLS). */
export function AdminsCard({ currentEmail }: { currentEmail: string }) {
  const [admins, setAdmins] = useState<string[] | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase.from('admins').select('email').order('email')
    if (!error) setAdmins(((data ?? []) as { email: string }[]).map((r) => r.email))
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!supabase) return
    const email = newEmail.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ese correo no parece válido.')
      return
    }
    setBusy(true)
    setError(null)
    const { error } = await supabase.from('admins').insert({ email })
    setBusy(false)
    if (error) {
      setError(error.code === '23505' ? 'Ese correo ya es administrador.' : 'No se pudo agregar. Inténtalo de nuevo.')
    } else {
      setNewEmail('')
      await load()
    }
  }

  const handleRemove = async (email: string) => {
    if (!supabase) return
    setBusy(true)
    setError(null)
    const { error } = await supabase.from('admins').delete().eq('email', email)
    setBusy(false)
    setConfirmRemove(null)
    if (error) setError('No se pudo quitar. Inténtalo de nuevo.')
    else await load()
  }

  return (
    <div className="bg-white border border-rose-blush/50 p-5 space-y-4">
      <div>
        <p className="font-serif text-lg text-warm-text">Administradores</p>
        <p className="font-sans text-xs text-warm-muted mt-1">
          Cuentas de Google con acceso a este panel. No puedes quitarte a ti mismo.
        </p>
      </div>

      {admins === null ? (
        <p className="font-sans text-xs text-warm-muted animate-pulse">Cargando…</p>
      ) : (
        <ul className="space-y-2">
          {admins.map((email) => (
            <li key={email} className="flex items-center justify-between gap-3 border-b border-rose-blush/20 pb-2 last:border-0 last:pb-0">
              <span className="font-sans text-sm text-warm-text break-all">
                {email}
                {email === currentEmail.toLowerCase() && (
                  <span className="ml-2 font-sans text-[10px] uppercase tracking-wider text-warm-muted">(tú)</span>
                )}
              </span>
              {email !== currentEmail.toLowerCase() &&
                (confirmRemove === email ? (
                  <span className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleRemove(email)}
                      className="font-sans text-[11px] uppercase tracking-widest text-rose underline underline-offset-4 disabled:opacity-40"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmRemove(null)}
                      className="font-sans text-[11px] uppercase tracking-widest text-warm-muted underline underline-offset-4"
                    >
                      Cancelar
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmRemove(email)}
                    title="Quitar acceso"
                    className="shrink-0 p-1.5 text-warm-muted hover:text-rose transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0l.7 12.1a1 1 0 001 .9h4.6a1 1 0 001-.9L17 7" />
                    </svg>
                  </button>
                ))}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex flex-wrap gap-2">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="cuenta@gmail.com"
          className="flex-1 min-w-[200px] border border-rose-blush/60 px-3 py-2 font-sans text-sm text-warm-text focus:outline-none focus:border-rose transition-colors"
        />
        <button
          type="submit"
          disabled={busy || !newEmail.trim()}
          className="bg-rose border border-rose text-white font-sans text-[11px] uppercase tracking-widest px-5 py-2.5 hover:bg-rose-dark hover:border-rose-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Agregar
        </button>
      </form>

      {error && <p className="font-sans text-xs text-rose">{error}</p>}

      <p className="font-sans text-[11px] text-warm-muted/70">
        Debe ser la cuenta de Google con la que esa persona iniciará sesión.
      </p>
    </div>
  )
}
