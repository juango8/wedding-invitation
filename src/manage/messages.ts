// Personalized invitation messages sent from the manage page.
// Edit the templates freely — {placeholders} are filled by the functions below.

/** Canonical public URL of the invitation — links are ALWAYS built against prod, even from localhost. */
export const SITE_URL = 'https://juango8.github.io/wedding-invitation/'

export function inviteLink(token: string): string {
  return `${SITE_URL}?g=${token}`
}

export function inviteMessage(name: string, token: string): string {
  return (
    `¡Hola, ${name}! 💍\n` +
    `Nos casamos — Juango & Mafer — y queremos que celebres con nosotros.\n` +
    `📅 Sábado 18 de julio de 2026 · Arequipa\n\n` +
    `Esta es tu invitación personal, aquí puedes ver todos los detalles y confirmar tu asistencia:\n` +
    `${inviteLink(token)}\n\n` +
    `Por favor confírmanos antes del 20 de junio. ¡Te esperamos! 🤍`
  )
}

export function groupMessage(guests: { full_name: string; token: string }[]): string {
  const lines = guests.map((g) => `• ${g.full_name}: ${inviteLink(g.token)}`).join('\n')
  return (
    `¡Hola! 💍\n` +
    `Nos casamos — Juango & Mafer — y queremos que celebren con nosotros.\n` +
    `📅 Sábado 18 de julio de 2026 · Arequipa\n\n` +
    `Estas son sus invitaciones personales (cada enlace muestra los detalles y permite confirmar):\n` +
    `${lines}\n\n` +
    `Por favor confírmennos antes del 20 de junio. ¡Los esperamos! 🤍`
  )
}

/** wa.me deep link to a guest's phone (digits with country code) with the text prefilled. */
export function waSendUrl(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}
