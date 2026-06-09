import { BotanicalDivider } from '../assets/botanical'

export function OurStorySection() {
  return (
    <section id="our-story" className="py-24 px-8 md:px-16 bg-warm-light">
      <div className="max-w-3xl mx-auto">
        <BotanicalDivider className="w-48 mx-auto mb-12" />

        <h2 className="section-title text-center mb-12">Nuestra Historia</h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-5 text-warm-muted font-sans text-sm leading-relaxed text-justify">
            <p>
              Nos llena de inmensa alegría invitarlos a un momento que para nosotros es profundamente especial: nuestro gran ¡Sí! a una vida entera juntos.
            </p>
            <p>
              Nuestra historia, que dio un paso inolvidable entre las flores del icónico Rosedal en Buenos Aires, nos ha traído hasta este instante lleno de amor y certeza.
            </p>
            <p>
              Para nosotros, cada uno de ustedes ha sido una pieza fundamental en lo que somos hoy como pareja.
              A lo largo del tiempo hemos compartido experiencias maravillosas, risas sinceras y también algunas lágrimas, construyendo lazos que atesoramos con el alma.
            </p>
            <p>
              Por todo ello, no imaginamos dar este paso sin tenerlos a nuestro lado.
              Hoy queremos que formen parte del día más importante de nuestras vidas: la celebración de nuestro matrimonio.
            </p>
          </div>

          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://res.cloudinary.com/ddcsty2aq/image/upload/q_auto/f_auto/v1780281289/WhatsApp_Image_2026-05-31_at_21.34.23_fu8psi.jpg"
              alt="Juango y Mafer"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <BotanicalDivider className="w-48 mx-auto mt-12" />
      </div>
    </section>
  )
}
