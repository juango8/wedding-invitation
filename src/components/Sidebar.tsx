import { useState } from 'react'

const NAV_ITEMS = [
  { label: 'Historia', href: '#our-story' },
  { label: 'Itinerario', href: '#itinerary' },
  { label: 'El Lugar', href: '#venue' },
  { label: 'Asistencia', href: '#rsvp' },
  { label: 'Regalos', href: '#registry' },
]

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-36 bg-white z-20 border-r border-rose-blush/40 px-5 py-10">
        <div className="mb-5">
          <p className="font-serif text-sm text-warm-text leading-snug">Juango & Mafer</p>
          <p className="font-sans text-[10px] uppercase tracking-wider text-warm-muted mt-1">18 · julio · 2026</p>
          <div className="mt-4 h-px bg-rose-blush/50 w-full" />
        </div>
        <nav className="flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link text-left"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-20 border-b border-rose-blush/40 px-6 flex items-center justify-between">
        <div>
          <p className="font-serif text-sm text-warm-text">Juango & Mafer</p>
          <p className="font-sans text-[13px] uppercase tracking-widest text-warm-muted">18 de julio de 2026</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col items-center justify-center gap-1.5 min-w-11 min-h-11 -mr-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-warm-text transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-warm-text transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-warm-text transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {open && (
        <nav className="md:hidden fixed top-16 left-0 right-0 bg-white z-20 border-b border-rose-blush/40 px-6 py-6 flex flex-col gap-5 shadow-sm">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="nav-link text-left"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </>
  )
}
