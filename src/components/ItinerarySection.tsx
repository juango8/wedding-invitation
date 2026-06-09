import { BotanicalDivider } from '../assets/botanical'

const SCHEDULE = [
  { time: '11:30 AM', label: 'Ceremonia', description: 'Inicio de la ceremonia civil' },
  { time: '1:00 PM', label: 'Recepción', description: 'Cócteles, Almuerzo y baile' },
  { time: '7:30 PM', label: 'Hasta pronto', description: 'Cierre de la celebración' },
]

export function ItinerarySection() {
  return (
    <section id="itinerary" className="py-24 px-8 md:px-16 bg-warm-light">
      <div className="max-w-2xl mx-auto">
        <BotanicalDivider className="w-48 mx-auto mb-12" />
        <h2 className="section-title text-center mb-12">Itinerario</h2>

        {/* Schedule */}
        <div className="relative mb-16">
          {/* Vertical line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-rose-blush/40 hidden sm:block" />

          <div className="space-y-8">
            {SCHEDULE.map((item, i) => (
              <div key={i} className="flex items-start gap-10 sm:gap-12">
                {/* Time */}
                <div className="w-16 shrink-0 text-right">
                  <span className="font-sans text-[11px] uppercase tracking-widest text-rose">{item.time}</span>
                </div>

                {/* Dot */}
                <div className="relative shrink-0 hidden sm:flex items-center justify-center w-3 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-rose bg-warm-light z-10" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <p className="font-serif text-warm-text text-lg leading-tight">{item.label}</p>
                  <p className="font-sans text-sm text-warm-muted mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dress code */}
        <div className="border border-rose-blush/50 p-8 bg-white text-center">
          <p className="font-sans text-[11px] uppercase tracking-widest text-rose mb-4">Código de vestimenta</p>
          <p className="font-serif text-2xl text-warm-text mb-3">Etiqueta estricta</p>
          <p className="font-sans text-sm text-warm-muted leading-relaxed max-w-xs mx-auto mb-6">
            Caballeros: terno oscuro o smoking. Damas: vestido largo de gala.
            Por favor evitar el color blanco.
          </p>
          {/* Palette swatches */}
          <div className="flex items-center justify-center gap-3">
            {[
              { color: '#3a4a31', name: 'Verde bosque' },
              { color: '#737041', name: 'Olivo' },
              { color: '#6c402a', name: 'Terracota' },
              { color: '#c9a882', name: 'Beige cálido' },
            ].map(({ color, name }) => (
              <div key={color} className="relative group flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full border border-black/10 cursor-default"
                  style={{ backgroundColor: color }}
                />
                <div className="absolute bottom-full mb-2 px-2 py-1 bg-warm-text text-white font-sans text-[10px] tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-warm-text" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <BotanicalDivider className="w-48 mx-auto mt-12" />
      </div>
    </section>
  )
}
