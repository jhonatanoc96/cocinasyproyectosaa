import type { Configuracion } from "@/sanity/types";

export type TipoCotizacion = "general" | "cocina" | "mobiliario" | "proyecto";

/** Placeholder text the client still has to replace (e.g. "[PENDIENTE]"). */
export function esPendiente(valor?: string | null): boolean {
  return !valor || /\[PENDIENTE/i.test(valor);
}

export function numeroWhatsapp(config: Configuracion): string | null {
  const numero = config.whatsapp?.replace(/\D/g, "");
  return numero ? numero : null;
}

export function waLink(numero: string, texto?: string): string {
  return `https://wa.me/${numero}${
    texto ? `?text=${encodeURIComponent(texto)}` : ""
  }`;
}

/** Direct wa.me link (floating button), or null when no number is configured. */
export function whatsappUrl(
  config: Configuracion,
  mensaje?: string
): string | null {
  const numero = numeroWhatsapp(config);
  return numero ? waLink(numero, mensaje ?? config.mensajeWhatsapp) : null;
}

/** Every "quote" button goes to the quote form, which ends in WhatsApp. */
export function cotizarHref(
  tipo: TipoCotizacion = "general",
  proyecto?: string
): string {
  const params = new URLSearchParams();
  if (tipo !== "general") params.set("tipo", tipo);
  if (proyecto) params.set("proyecto", proyecto);
  const qs = params.toString();
  return `/cotizar${qs ? `?${qs}` : ""}`;
}

/**
 * WhatsApp message: the predefined text for the quote type plus, when the
 * client filled any field, their data below a heading.
 */
export function construirMensaje(
  base: string,
  encabezado: string,
  datos: { etiqueta: string; valor: string }[]
): string {
  const llenos = datos
    .map((d) => ({ ...d, valor: d.valor.trim() }))
    .filter((d) => d.valor);
  if (llenos.length === 0) return base;
  return [
    base,
    "",
    encabezado,
    ...llenos.map((d) => `*${d.etiqueta}:* ${d.valor}`),
  ].join("\n");
}

export function telHref(telefono: string): string {
  return `tel:${telefono.replace(/[^\d+]/g, "")}`;
}

/** "573116424701" → "+57 311 642 4701" (Colombian numbers; others untouched). */
export function formatoTelefono(numero: string): string {
  const d = numero.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("57"))
    return `+57 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return `+${d}`;
}

export interface DatoContacto {
  label: string;
  value: string;
  href?: string;
  externo?: boolean;
  pendiente: boolean;
}

/** Contact data from the CMS. `incluirPendientes` keeps "[PENDIENTE]" values as plain text. */
export function datosContacto(
  config: Configuracion,
  incluirPendientes = false
): DatoContacto[] {
  const numero = numeroWhatsapp(config);
  const lista: (DatoContacto | null)[] = [
    numero
      ? {
          label: "WhatsApp",
          value: formatoTelefono(numero),
          href: waLink(numero, config.mensajeWhatsapp),
          externo: true,
          pendiente: false,
        }
      : null,
    dato("Teléfono", config.telefono, (v) => telHref(v)),
    dato("Correo", config.email, (v) => `mailto:${v}`),
    dato("Dirección", config.direccion, () => config.mapaUrl, true),
    dato("Cobertura", config.ciudad),
    dato("Horario", config.horario),
  ];
  return lista.filter(
    (d): d is DatoContacto => d !== null && (incluirPendientes || !d.pendiente)
  );
}

function dato(
  label: string,
  value: string | undefined,
  href?: (v: string) => string | undefined,
  externo = false
): DatoContacto | null {
  if (!value?.trim()) return null;
  const pendiente = esPendiente(value);
  return {
    label,
    value,
    href: pendiente || !href ? undefined : href(value),
    externo,
    pendiente,
  };
}
