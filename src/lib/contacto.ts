import type { Configuracion } from "@/sanity/types";

/** wa.me link, or null when the WhatsApp number hasn't been set in the CMS yet. */
export function whatsappUrl(
  config: Configuracion,
  mensaje?: string
): string | null {
  const numero = config.whatsapp?.replace(/\D/g, "");
  if (!numero) return null;
  const texto = mensaje ?? config.mensajeWhatsapp;
  return `https://wa.me/${numero}${
    texto ? `?text=${encodeURIComponent(texto)}` : ""
  }`;
}

/** Where every "quote" button points: WhatsApp when configured, otherwise the contact page. */
export function cotizarHref(
  config: Configuracion,
  mensaje?: string
): { href: string; externo: boolean } {
  const wa = whatsappUrl(config, mensaje);
  return wa
    ? { href: wa, externo: true }
    : { href: "/contacto", externo: false };
}

export function telHref(telefono: string): string {
  return `tel:${telefono.replace(/[^\d+]/g, "")}`;
}
