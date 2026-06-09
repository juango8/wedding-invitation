import { BotanicalDivider } from '../assets/botanical'
import couplePhoto from '../assets/green_image.png'

export function VenueSection() {
  return (
    <section id="venue" className="relative py-24 px-8 md:px-16 bg-white overflow-hidden">
      {/* Botanical background — right side */}
      <div className="absolute right-0 top-0 h-full w-[52%] pointer-events-none select-none">
        <img src={couplePhoto} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <BotanicalDivider className="w-48 mx-auto mb-12" />
        <h2 className="section-title text-center mb-12">El Lugar</h2>

        {/* Venue card */}
        <div className="border border-rose-blush/60 p-8 bg-white mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3 className="font-serif text-2xl text-warm-text mb-1">Khunan Pacha</h3>
              <p className="font-sans text-sm text-warm-muted">Calle San Francisco 217, Arequipa, Perú</p>
              <p className="font-sans text-[11px] text-warm-muted/70 mt-2 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4 shrink-0">
                  <circle cx="12" cy="12" r="10.5" />
                  <text x="6" y="18" fontSize="18" fontWeight="bold" fontFamily="serif" fill="currentColor" stroke="none">P</text>
                  <line x1="4.5" y1="4.5" x2="19.5" y2="19.5" strokeWidth="1.6" />
                </svg>
                El lugar no cuenta con estacionamiento
              </p>
            </div>
            <p className="font-sans text-[11px] uppercase tracking-widest text-rose shrink-0">Sábado, 18 de julio de 2026</p>
          </div>
        </div>

        {/* Google Maps embed */}
        <div className="w-full aspect-[16/7] border border-rose-blush/40 overflow-hidden">
          <iframe
            title="Khunan Pacha — Calle San Francisco 217, Arequipa"
            src="https://maps.google.com/maps?q=Calle+San+Francisco+217,+Arequipa,+Per%C3%BA&output=embed&hl=es&z=16"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <BotanicalDivider className="w-48 mx-auto mt-12" />
      </div>
    </section>
  )
}
