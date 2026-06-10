// TODO: replace with the couple's real number before sending invitations (digits with country code).
export const WHATSAPP_PHONE = '51999999999'

export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}
