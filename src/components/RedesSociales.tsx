import type { ReactNode } from "react";
import type { Configuracion } from "@/sanity/types";

/** Simple line icons, drawn on a 24×24 grid with currentColor. */
const ICONOS: Record<string, ReactNode> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: (
    <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H9v3h2.5V21" />
  ),
  tiktok: (
    <path d="M14.5 3.5v11.2a3.7 3.7 0 1 1-3.7-3.7M14.5 3.5c.4 2.6 2.1 4.2 4.8 4.4" />
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.2v5.6l4.8-2.8z" fill="currentColor" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.6 20.6l1.9-8.1M10.3 13.6c.6 1 1.6 1.4 2.6 1.4 2.3 0 3.6-2 3.6-4.3 0-2.5-2-4.2-4.5-4.2-2.8 0-4.6 1.9-4.6 4.2 0 .9.3 1.7.9 2.2" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V17M8 7.4v.2M11.5 17v-6.5M11.5 13.2c0-1.6 1.1-2.8 2.5-2.8s2.2 1 2.2 2.6V17" />
    </>
  ),
  x: <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />,
};

export function IconoRed({
  red,
  className = "h-5 w-5",
}: {
  red: string;
  className?: string;
}) {
  const icono = ICONOS[red.toLowerCase()];
  if (!icono) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {icono}
    </svg>
  );
}

/** Only the networks configured in the CMS (with a URL) are rendered. */
export function RedesSociales({
  redes,
  className = "",
  itemClassName = "",
}: {
  redes: Configuracion["redes"];
  className?: string;
  itemClassName?: string;
}) {
  const lista = (redes ?? []).filter((r) => r.url && r.red);
  if (lista.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {lista.map((r) => (
        <li key={r._key}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={r.red}
            title={r.red}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${itemClassName}`}
          >
            <IconoRed red={r.red!} />
          </a>
        </li>
      ))}
    </ul>
  );
}
