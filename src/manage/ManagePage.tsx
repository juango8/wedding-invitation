import { useEffect, useState } from 'react'
import { useAdminSession } from '../hooks/useAdminSession'
import { supabase } from '../lib/supabase'

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-light flex items-center justify-center px-6">
      <div className="bg-white border border-rose-blush/50 p-10 max-w-sm w-full text-center space-y-5">
        {children}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 001 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  )
}

function LoginScreen({ onSignIn }: { onSignIn: () => void }) {
  return (
    <CenteredCard>
      <p className="font-serif text-2xl text-warm-text">Juango &amp; Mafer</p>
      <p className="font-sans text-[12px] uppercase tracking-widest text-warm-muted">Panel de gestión</p>
      <button
        type="button"
        onClick={onSignIn}
        className="w-full inline-flex items-center justify-center gap-3 border border-rose-blush/60 bg-white text-warm-text font-sans text-[12px] uppercase tracking-widest px-6 py-3.5 hover:border-rose hover:text-rose transition-colors duration-200"
      >
        <GoogleIcon />
        Continuar con Google
      </button>
      <p className="font-sans text-xs text-warm-muted/70">Solo para los novios 🤍</p>
      <a
        href={import.meta.env.BASE_URL}
        className="block font-sans text-[11px] uppercase tracking-widest text-warm-muted underline underline-offset-4 hover:text-rose transition-colors"
      >
        ← Volver a la invitación
      </a>
    </CenteredCard>
  )
}

function Unauthorized({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <CenteredCard>
      <p className="font-serif text-2xl text-warm-text">No autorizado</p>
      <p className="font-sans text-sm text-warm-muted leading-relaxed">
        La cuenta <span className="text-warm-text break-all">{email}</span> no tiene acceso a este panel.
      </p>
      <button
        type="button"
        onClick={onSignOut}
        className="w-full bg-rose border border-rose text-white font-sans text-[12px] uppercase tracking-widest px-6 py-3 hover:bg-rose-dark hover:border-rose-dark transition-colors duration-300"
      >
        Cerrar sesión
      </button>
    </CenteredCard>
  )
}

function AdminShell({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [guestCount, setGuestCount] = useState<number | null>(null)

  useEffect(() => {
    if (!supabase) return
    const sb = supabase
    let cancelled = false
    void sb
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (!cancelled && !error) setGuestCount(count ?? 0)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-warm-light">
      <header className="bg-white border-b border-rose-blush/40 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-serif text-xl text-warm-text leading-tight">Gestión de invitados</p>
          <p className="font-sans text-[11px] uppercase tracking-widest text-warm-muted">Juango &amp; Mafer · 18 · 07 · 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-sans text-xs text-warm-muted hidden sm:inline">{email}</span>
          <button
            type="button"
            onClick={onSignOut}
            className="font-sans text-[11px] uppercase tracking-widest text-warm-muted underline underline-offset-4 hover:text-rose transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border border-rose-blush/50 p-8 text-center space-y-3">
          <p className="font-serif text-xl text-warm-text">Conexión verificada</p>
          <p className="font-sans text-sm text-warm-muted">
            Invitados en la base:{' '}
            <span className="text-warm-text font-medium">{guestCount === null ? '…' : guestCount}</span>
          </p>
          <p className="font-sans text-xs text-warm-muted/70">
            El panel completo (lista, altas, envíos) llega en la fase 4.
          </p>
        </div>
      </main>
    </div>
  )
}

export function ManagePage() {
  const { state, signIn, signOut } = useAdminSession()

  useEffect(() => {
    const prev = document.title
    document.title = 'Gestión — Juango & Mafer'
    return () => {
      document.title = prev
    }
  }, [])

  switch (state.kind) {
    case 'no_backend':
      return (
        <CenteredCard>
          <p className="font-serif text-2xl text-warm-text">Configuración incompleta</p>
          <p className="font-sans text-sm text-warm-muted">
            Faltan las variables de Supabase en este despliegue.
          </p>
        </CenteredCard>
      )
    case 'loading':
      return (
        <div className="min-h-screen bg-warm-light flex items-center justify-center">
          <p className="font-sans text-sm text-warm-muted animate-pulse">Cargando…</p>
        </div>
      )
    case 'signed_out':
      return <LoginScreen onSignIn={() => void signIn()} />
    case 'unauthorized':
      return <Unauthorized email={state.email} onSignOut={() => void signOut()} />
    case 'admin':
      return <AdminShell email={state.email} onSignOut={() => void signOut()} />
  }
}
