// Couple's contact number for guest-facing buttons (digits with country code, no "+").
export const WHATSAPP_PHONE = '51997867243'

export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}
