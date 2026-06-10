import { useState } from 'react'
import { BotanicalDivider } from '../assets/botanical'
import couplePhoto from '../assets/green_image.png'

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS context) — silently ignore
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-warm-text/60 text-[11px] uppercase tracking-wider shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-warm-text truncate">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? `${label} copiado` : `Copiar ${label}`}
          title={copied ? '¡Copiado!' : 'Copiar'}
          className="shrink-0 p-1.5 -m-1 text-warm-muted hover:text-rose transition-colors duration-200"
        >
          {copied ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-rose">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
              <rect x="9" y="9" width="11" height="11" rx="1.5" />
              <path d="M5 15H4.5A1.5 1.5 0 013 13.5v-9A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5V5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export function RSVPSection() {
  const [attending, setAttending] = useState<'yes' | 'no' | ''>('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const message = data.get('message') as string

    const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL

    setLoading(true)
    setError(false)

    if (!scriptUrl) {
      console.error('RSVP: VITE_APPS_SCRIPT_URL is not configured in .env file.')
      setError(true)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          name,
          attending: attending === 'yes' ? 'Sí, ¡con gusto!' : 'Con pena, no podré',
          message: message || '',
        }),
      })

      if (!response.ok) {
        throw new Error('RSVP submission failed on server')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('RSVP submission error:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* RSVP */}
      <section id="rsvp" className="relative py-24 px-8 md:px-16 bg-white overflow-hidden">
        {/* Botanical background — right side */}
        <div className="absolute right-0 top-0 h-full w-[52%] pointer-events-none select-none">
          <img src={couplePhoto} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        </div>
        <div className="max-w-xl mx-auto relative z-10">
          <BotanicalDivider className="w-48 mx-auto mb-12" />
          <h2 className="section-title text-center mb-4">¡Estás invitado a nuestra boda!</h2>
          <p className="text-center font-sans text-[12px] uppercase tracking-widest text-warm-muted mb-12">
            Por favor confirma antes del 20 de junio de 2026
          </p>

          {submitted ? (
            <div className="text-center py-10">
              <p className="font-serif text-2xl text-warm-text mb-3">¡Muchas gracias!</p>
              <p className="font-sans text-sm text-warm-muted">Tu confirmación fue enviada. ¡Tenemos muchas ganas de verte!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-sans text-[12px] uppercase tracking-widest text-warm-muted mb-2">
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  type="text"
                  className="w-full border border-rose-blush/60 px-4 py-3 font-sans text-sm text-warm-text bg-white focus:outline-none focus:border-rose transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <p className="block font-sans text-[12px] uppercase tracking-widest text-warm-muted mb-3">
                  ¿Asistirás?
                </p>
                <div className="flex gap-4">
                  {(['yes', 'no'] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAttending(val)}
                      className={`flex-1 py-3 border font-sans text-[11px] uppercase tracking-widest transition-colors duration-200 ${attending === val
                        ? 'bg-rose-dark border-rose-dark text-white'
                        : 'bg-rose border-rose text-white hover:bg-rose-dark hover:border-rose-dark'
                        }`}
                    >
                      {val === 'yes' ? '¡Con mucho gusto!' : 'Con pena, no podré'}
                    </button>
                  ))}
                </div>
                {attending === 'no' && (
                  <p className="mt-3 font-serif italic text-warm-muted text-sm">
                    ¡Te echaremos de menos! Igual te queremos mucho 🤎
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block font-sans text-[12px] uppercase tracking-widest text-warm-muted mb-2">
                  Mensaje para los novios <span className="normal-case text-warm-muted/60">(opcional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full border border-rose-blush/60 px-4 py-3 font-sans text-sm text-warm-text bg-white focus:outline-none focus:border-rose transition-colors resize-none"
                  placeholder="Comparte unas palabras bonitas…"
                />
              </div>

              {error && (
                <div className="border border-rose/30 bg-rose/5 p-5 text-center space-y-3">
                  <p className="font-sans text-[12px] text-rose">
                    Hubo un problema al enviar tu confirmación.
                  </p>
                  <p className="font-sans text-[11px] text-warm-muted">
                    Por favor escríbenos directamente por WhatsApp:
                  </p>
                  <a
                    href={`https://wa.me/51999999999?text=${encodeURIComponent('¡Hola! Quiero confirmar mi asistencia a la boda de Juango y Mafer 🤍')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-rose border border-rose text-white font-sans text-[11px] uppercase tracking-widest px-6 py-2.5 hover:bg-rose-dark hover:border-rose-dark transition-colors duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Escribir por WhatsApp
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={!attending || loading}
                className="w-full bg-rose border border-rose text-white font-sans text-[12px] uppercase tracking-widest py-4 hover:bg-rose-dark hover:border-rose-dark transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando…' : attending === 'no' ? 'Enviar respuesta' : 'Confirmar asistencia'}
              </button>
            </form>
          )}

          <BotanicalDivider className="w-48 mx-auto mt-12" />
        </div>
      </section>

      {/* Registry */}
      <section id="registry" className="py-24 px-8 md:px-16 bg-warm-light">
        <div className="max-w-xl mx-auto text-center">
          <BotanicalDivider className="w-48 mx-auto mb-12" />
          <h2 className="section-title mb-8">Regalos</h2>

          {/* Text card */}
          <div className="border border-rose-blush/50 p-8 bg-white max-w-sm mx-auto mb-6">
            <p className="font-sans text-sm text-warm-muted leading-relaxed">
              Tu presencia es el mejor regalo de todos. Para quienes deseen celebrar con un obsequio,
              aquí te dejamos nuestros datos:
            </p>
          </div>

          {/* Bank account cards */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Juango */}
            <div className="border border-rose-blush/50 p-6 text-left bg-white">
              <p className="font-serif text-warm-text text-base mb-4">Juango</p>
              <div className="space-y-3 font-sans text-sm text-warm-muted">
                <div className="flex justify-between gap-4">
                  <span className="text-warm-text/60 text-[11px] uppercase tracking-wider">Banco</span>
                  <span className="text-warm-text">Interbank</span>
                </div>
                <div className="h-px bg-rose-blush/30" />
                <CopyableRow label="Cuenta" value="3003090873329" />
                <div className="h-px bg-rose-blush/30" />
                <CopyableRow label="CCI" value="00330001309087332913" />
              </div>            </div>

            {/* Mafer */}
            <div className="border border-rose-blush/50 p-6 text-left bg-white">
              <p className="font-serif text-warm-text text-base mb-4">Mafer</p>
              <div className="space-y-3 font-sans text-sm text-warm-muted">
                <div className="flex justify-between gap-4">
                  <span className="text-warm-text/60 text-[11px] uppercase tracking-wider">Banco</span>
                  <span className="text-warm-text">Banco de Crédito del Perú (BCP)</span>
                </div>
                <div className="h-px bg-rose-blush/30" />
                <CopyableRow label="Cuenta" value="21536301738018" />
                <div className="h-px bg-rose-blush/30" />
                <CopyableRow label="CCI" value="00221513630173801820" />
              </div>            </div>
          </div>
          <BotanicalDivider className="w-48 mx-auto mt-12" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 bg-white border-t border-rose-blush/30 text-center">
        <p className="font-serif text-warm-text text-lg mb-1">Juango & Mafer</p>
        <p className="font-sans text-[13px] uppercase tracking-widest text-warm-muted">18 de julio de 2026 · Arequipa, Perú</p>
        <BotanicalDivider className="w-32 mx-auto mt-6" />
      </footer>
    </>
  )
}
