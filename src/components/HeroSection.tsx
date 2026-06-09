import couplePhoto from '../assets/green_image.png'

const PORTRAIT_URL =
  'https://res.cloudinary.com/ddcsty2aq/image/upload/q_auto/f_auto/v1780282697/copy_of_whatsapp_image_2026-05-31_at_213500_w5n2uw.jpg'

function CouplePortrait({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden shadow-lg ${className}`}>
      <img
        src={PORTRAIT_URL}
        alt="Juango y Mafer"
        className="w-full h-full object-cover"
        loading="eager"
      />
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center md:flex-row md:justify-start md:items-center overflow-hidden bg-white">

      {/* Botanical illustration — right half on desktop */}
      <div className="hidden md:block absolute right-0 top-0 w-[52%] h-full">
        <img
          src={couplePhoto}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <CouplePortrait className="absolute left-[33%] top-1/2 -translate-y-1/2 z-20 w-[42%] aspect-[3/4]" />
      </div>

      {/* Mobile: botanical image + portrait overlay */}
      <div className="md:hidden order-2 w-full h-[60vh] mt-10 relative">
        <img
          src={couplePhoto}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <CouplePortrait className="w-3/4 aspect-[3/4]" />
        </div>
      </div>

      {/* Names & date */}
      <div className="order-1 relative z-10 pl-8 pr-8 md:pr-0 md:pl-12 max-w-sm pt-24 md:pt-0">
        <p className="font-sans text-[12px] uppercase tracking-[0.3em] text-warm-muted mb-6">
          ¡Nos casamos!
        </p>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-warm-text leading-tight font-normal">
          Juango
          <br />
          <span className="text-rose italic text-3xl md:text-4xl font-serif font-normal">&</span>
          <br />
          Mafer
        </h1>
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-rose/30 max-w-[60px]" />
          <time dateTime="2026-07-18" className="font-sans text-[13px] uppercase tracking-[0.25em] text-warm-muted whitespace-nowrap">
            18 de julio de 2026
          </time>
          <div className="h-px flex-1 bg-rose/30 max-w-[60px]" />
        </div>
        <p className="mt-4 font-serif italic text-warm-muted text-base">Arequipa, Perú</p>
        <a
          href="#rsvp"
          className="mt-10 inline-block bg-rose border border-rose text-white font-sans text-[12px] uppercase tracking-widest px-8 py-3 hover:bg-rose-dark hover:border-rose-dark transition-colors duration-300"
        >
          Confirmar asistencia
        </a>
      </div>
    </section>
  )
}
