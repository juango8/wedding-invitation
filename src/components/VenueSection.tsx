import { BotanicalDivider } from '../assets/botanical'

export function VenueSection() {
  return (
    <section id="venue" className="py-24 px-8 md:px-16 bg-warm-light">
      <div className="max-w-3xl mx-auto">
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

        {/* Navigation buttons */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Khunan+Pacha%2C+Calle+San+Francisco+217%2C+Arequipa%2C+Per%C3%BA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-rose border border-rose text-white font-sans text-[12px] uppercase tracking-widest py-4 hover:bg-rose-dark hover:border-rose-dark transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0">
              <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            Abrir en Google Maps
          </a>
          <a
            href="https://waze.com/ul?q=Calle%20San%20Francisco%20217%2C%20Arequipa%2C%20Per%C3%BA&navigate=yes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-white border border-rose text-rose font-sans text-[12px] uppercase tracking-widest py-4 hover:bg-rose hover:text-white transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 shrink-0">
              <path d="M3 11l18-7-7 18-2.5-7.5L3 11z" />
            </svg>
            Abrir en Waze
          </a>
        </div>

        <BotanicalDivider className="w-48 mx-auto mt-12" />
      </div>
    </section>
  )
}
