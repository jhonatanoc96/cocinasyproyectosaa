import Link from "next/link";
import type { ReactNode } from "react";
import { SanityImg } from "./SanityImg";
import type { Foto, Pagina, ProyectoResumen } from "@/sanity/types";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}

export interface BotonProps {
  href: string;
  children: ReactNode;
  externo?: boolean;
  variante?: "oscuro" | "claro" | "borde" | "borde-claro";
  className?: string;
}

const VARIANTES = {
  oscuro: "bg-ink text-bone hover:bg-walnut",
  claro: "bg-bone text-ink hover:bg-sand",
  borde:
    "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-bone",
  "borde-claro": "border border-bone/40 text-bone hover:bg-bone hover:text-ink",
};

export function Boton({
  href,
  children,
  externo,
  variante = "oscuro",
  className = "",
}: BotonProps) {
  const cls = `inline-flex h-13 items-center justify-center gap-3 rounded-full px-7 text-[0.82rem] font-semibold tracking-wide transition-colors duration-300 ${VARIANTES[variante]} ${className}`;
  if (externo || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Flecha({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden
    >
      <path d="M3 9h12M10 4l5 5-5 5" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.68 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.3 11.3 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.36-11.37 0-3.04-1.18-5.89-3.33-8.04" />
    </svg>
  );
}

/** Header for inner pages: title + intro on the left, tall photo on the right. */
export function PageHeader({
  pagina,
  fallbackTitulo,
}: {
  pagina: Pagina | null;
  fallbackTitulo: string;
}) {
  return (
    <section className="bg-bone pt-28 pb-16 lg:pt-36 lg:pb-24">
      <Container className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 lg:pb-6">
          {pagina?.etiqueta && (
            <p className="eyebrow hero-copy mb-6 text-walnut">
              {pagina.etiqueta}
            </p>
          )}
          <h1 className="display text-[clamp(3rem,7vw,6.5rem)]">
            {pagina?.titulo ?? fallbackTitulo}
          </h1>
          {pagina?.intro && (
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
              {pagina.intro}
            </p>
          )}
        </div>
        {pagina?.imagen && (
          <div className="relative aspect-[4/5] overflow-hidden bg-stone sm:aspect-[16/11] lg:col-span-6 lg:aspect-[5/6]">
            <SanityImg
              foto={pagina.imagen}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="hero-img"
            />
          </div>
        )}
      </Container>
    </section>
  );
}

export function SectionHead({
  etiqueta,
  titulo,
  texto,
  accion,
  tono = "oscuro",
}: {
  etiqueta?: string;
  titulo?: string;
  texto?: string;
  accion?: ReactNode;
  tono?: "oscuro" | "claro";
}) {
  return (
    <div className="reveal mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {etiqueta && (
          <p
            className={`eyebrow mb-5 ${
              tono === "claro" ? "text-sand" : "text-walnut"
            }`}
          >
            {etiqueta}
          </p>
        )}
        {titulo && (
          <h2 className="display text-[clamp(2.6rem,5vw,4.5rem)]">{titulo}</h2>
        )}
        {texto && (
          <p
            className={`mt-6 max-w-xl leading-relaxed ${
              tono === "claro" ? "text-bone/65" : "text-muted"
            }`}
          >
            {texto}
          </p>
        )}
      </div>
      {accion}
    </div>
  );
}

export function EnlaceFlecha({
  href,
  children,
  tono = "oscuro",
}: {
  href: string;
  children: ReactNode;
  tono?: "oscuro" | "claro";
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex shrink-0 items-center gap-3 border-b pb-1.5 text-sm font-semibold tracking-wide ${
        tono === "claro" ? "border-bone/40 text-bone" : "border-ink/30 text-ink"
      }`}
    >
      {children}
      <Flecha className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function ProyectoCard({
  proyecto,
  aspecto = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 45vw, 100vw",
}: {
  proyecto: ProyectoResumen;
  aspecto?: string;
  sizes?: string;
}) {
  return (
    <Link href={`/proyectos/${proyecto.slug}`} className="group reveal block">
      <div className={`relative overflow-hidden bg-stone ${aspecto}`}>
        <SanityImg
          foto={proyecto.portada}
          fill
          sizes={sizes}
          className="transition-transform duration-[1.4s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-bone/90 px-3 py-1.5 text-[0.7rem] font-semibold tracking-wide text-ink backdrop-blur">
          {proyecto.totalFotos} fotografías
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="display text-[1.9rem] sm:text-[2.2rem]">
            {proyecto.titulo}
          </h3>
          {proyecto.resumen && (
            <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-muted">
              {proyecto.resumen}
            </p>
          )}
        </div>
        <span className="mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-bone">
          <Flecha />
        </span>
      </div>
    </Link>
  );
}

export function CtaBanner({
  titulo,
  texto,
  boton,
  href,
  externo,
  imagen,
}: {
  titulo?: string;
  texto?: string;
  boton?: string;
  href: string;
  externo: boolean;
  imagen?: Foto;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-bone">
      {imagen && (
        <SanityImg
          foto={imagen}
          fill
          sizes="100vw"
          className="-z-10 opacity-45"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <Container className="py-28 lg:py-40">
        <div className="reveal max-w-2xl">
          <p className="eyebrow mb-6 text-sand">Cotización</p>
          <h2 className="display text-[clamp(3rem,6.5vw,6rem)]">
            {titulo ?? "Cotice su proyecto"}
          </h2>
          {texto && (
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone/70">
              {texto}
            </p>
          )}
          <div className="mt-10">
            <Boton href={href} externo={externo} variante="claro">
              {externo && <WhatsAppIcon />}
              {boton ?? "Cotizar proyecto"}
            </Boton>
          </div>
        </div>
      </Container>
    </section>
  );
}
