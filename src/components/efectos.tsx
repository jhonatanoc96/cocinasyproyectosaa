import { Fragment } from "react";
import { LogoMarca } from "./Logo";

/** Heading split into words that rise from a mask, one after another. */
export function Palabras({ texto, desde = 0 }: { texto: string; desde?: number }) {
  const palabras = texto.split(/\s+/).filter(Boolean);
  return (
    <span className="palabras" aria-label={texto}>
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden>
            <span style={{ ["--i" as string]: i + desde }}>{p}</span>
          </span>
          {i < palabras.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Infinite band of services (the work categories from the CMS), alternating
 * solid and outlined serif type, separated by the monogram.
 */
export function Marquee({
  items,
  className = "",
  duracion = 48,
}: {
  items: string[];
  className?: string;
  duracion?: number;
}) {
  if (items.length === 0) return null;
  const grupo = (oculto: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {items.map((t, i) => (
        <li key={`${t}-${i}`} className="flex items-center">
          <span
            className={`display px-6 text-[clamp(2.2rem,4.4vw,4.2rem)] whitespace-nowrap sm:px-10 ${
              i % 2 === 1 ? "contorno" : ""
            }`}
          >
            {t}
          </span>
          <LogoMarca className="h-6 w-8 shrink-0 opacity-50 sm:h-8 sm:w-10" />
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className={`marquee overflow-hidden ${className}`}
      style={{ ["--marquee-dur" as string]: `${duracion}s` }}
    >
      <div className="marquee-track flex w-max">
        {grupo(false)}
        {grupo(true)}
      </div>
    </div>
  );
}

/** Slowly rotating circular seal with the monogram in the centre. */
export function Sello({
  texto = "Diseño · Fabricación · A la medida · ",
  className = "",
}: {
  texto?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="girar h-full w-full">
        <defs>
          <path id="sello-circulo" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current text-[12.5px] font-semibold tracking-[0.3em] uppercase">
          <textPath href="#sello-circulo" textLength="486" lengthAdjust="spacing">
            {texto}
          </textPath>
        </text>
      </svg>
      <LogoMarca className="absolute top-1/2 left-1/2 h-10 w-12 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

/** "01 — Label" index used above section headings. */
export function Indice({
  n,
  label,
  tono = "oscuro",
}: {
  n: number;
  label: string;
  tono?: "oscuro" | "claro";
}) {
  return (
    <p
      className={`eyebrow mb-6 flex items-center gap-4 ${
        tono === "claro" ? "text-sand" : "text-walnut"
      }`}
    >
      <span className="tabular-nums">{String(n).padStart(2, "0")}</span>
      <span className={`h-px w-10 ${tono === "claro" ? "bg-sand/50" : "bg-walnut/40"}`} />
      {label}
    </p>
  );
}
