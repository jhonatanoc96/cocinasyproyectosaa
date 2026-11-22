"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState } from "react";
import {
  construirMensaje,
  type TipoCotizacion,
  waLink,
} from "@/lib/contacto";
import type { CampoCotizador, Cotizador } from "@/sanity/types";
import { WhatsAppIcon } from "./ui";

export interface CotizadorFormProps {
  cotizador: Cotizador;
  numero: string | null;
}

const DEFAULTS = {
  general: "Hola, quiero cotizar un proyecto con Cocinas y Proyectos AA.",
  cocina: "Hola, quiero cotizar una cocina a medida.",
  mobiliario: "Hola, quiero cotizar mobiliario a medida.",
  proyecto: 'Hola, vi el proyecto "{proyecto}" y quiero cotizar algo similar.',
};

/** Reads ?tipo= and ?proyecto= (must be rendered inside <Suspense>). */
export function CotizadorFormConParams(props: CotizadorFormProps) {
  const params = useSearchParams();
  const tipo = params.get("tipo");
  const proyecto = params.get("proyecto")?.slice(0, 120) ?? undefined;
  const inicial: TipoCotizacion =
    tipo === "cocina" || tipo === "mobiliario"
      ? tipo
      : proyecto
        ? "proyecto"
        : "general";
  return (
    <CotizadorForm
      key={`${inicial}-${proyecto ?? ""}`}
      {...props}
      tipoInicial={inicial}
      proyecto={proyecto}
    />
  );
}

export function CotizadorForm({
  cotizador: c,
  numero,
  tipoInicial = "general",
  proyecto: proyectoInicial,
}: CotizadorFormProps & { tipoInicial?: TipoCotizacion; proyecto?: string }) {
  const uid = useId();
  const [tipo, setTipo] = useState<TipoCotizacion>(tipoInicial);
  const [proyecto, setProyecto] = useState(proyectoInicial);
  const [valores, setValores] = useState<Record<string, string>>({});
  const campos = (c.campos ?? []).filter((f) => f.etiqueta);

  const opciones: { valor: TipoCotizacion; label: string }[] = [
    { valor: "cocina", label: c.opcionCocina || "Cocina" },
    { valor: "mobiliario", label: c.opcionMobiliario || "Mobiliario" },
    { valor: "general", label: c.opcionGeneral || "Otro proyecto" },
  ];

  const mensaje = useMemo(() => {
    const base =
      tipo === "proyecto" && proyecto
        ? (c.mensajeProyecto || DEFAULTS.proyecto).replaceAll("{proyecto}", proyecto)
        : tipo === "cocina"
          ? c.mensajeCocina || DEFAULTS.cocina
          : tipo === "mobiliario"
            ? c.mensajeMobiliario || DEFAULTS.mobiliario
            : c.mensajeGeneral || DEFAULTS.general;
    return construirMensaje(
      base,
      c.encabezadoDatos || "Mis datos:",
      campos.map((f) => ({ etiqueta: f.etiqueta, valor: valores[f._key] ?? "" }))
    );
  }, [tipo, proyecto, valores, campos, c]);

  const href = numero ? waLink(numero, mensaje) : null;

  return (
    <form
      className="bg-white/60 p-6 shadow-[0_30px_80px_-40px_rgba(22,20,18,.35)] ring-1 ring-line sm:p-10"
      onSubmit={(e) => {
        e.preventDefault();
        if (href) window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      <fieldset>
        <legend className="eyebrow mb-4 text-muted">
          {c.etiquetaTipo || "¿Qué quiere cotizar?"}
        </legend>
        <div className="flex flex-wrap gap-2">
          {opciones.map((o) => {
            const activa = tipo === o.valor;
            return (
              <label
                key={o.valor}
                className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-walnut ${
                  activa
                    ? "border-ink bg-ink text-bone"
                    : "border-ink/20 hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={o.valor}
                  checked={activa}
                  onChange={() => {
                    setTipo(o.valor);
                    setProyecto(undefined);
                  }}
                  className="sr-only"
                />
                {o.label}
              </label>
            );
          })}
        </div>
        {tipo === "proyecto" && proyecto && (
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            Referencia: <span className="font-semibold text-ink">{proyecto}</span>
            <button
              type="button"
              onClick={() => {
                setTipo("general");
                setProyecto(undefined);
              }}
              className="underline underline-offset-4 hover:text-ink"
            >
              Quitar
            </button>
          </p>
        )}
      </fieldset>

      {campos.length > 0 && (
        <div className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-2">
          {campos.map((f) => (
            <Campo
              key={f._key}
              id={`${uid}-${f._key}`}
              campo={f}
              valor={valores[f._key] ?? ""}
              onChange={(v) => setValores((prev) => ({ ...prev, [f._key]: v }))}
            />
          ))}
        </div>
      )}

      <details className="group mt-8 border-t border-line pt-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <span className="transition-transform group-open:rotate-90">›</span>
            Ver el mensaje que se enviará
          </span>
        </summary>
        <p className="mt-4 rounded-sm bg-stone/60 p-4 text-sm leading-relaxed whitespace-pre-wrap text-ink/80">
          {mensaje.replace(/\*/g, "")}
        </p>
      </details>

      <div className="mt-8">
        {href ? (
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#1f8f4d] px-8 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#187540] sm:w-auto"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {c.textoBoton || "Continuar en WhatsApp"}
          </button>
        ) : (
          <p className="rounded-sm border border-dashed border-walnut/50 p-4 text-sm text-muted">
            <mark className="pendiente">[PENDIENTE]</mark> Número de WhatsApp en
            Configuración del sitio.
          </p>
        )}
        <p className="mt-5 max-w-lg text-xs leading-relaxed text-muted">
          {c.nota ||
            "Ningún dato es obligatorio. Solo se usan para responder su solicitud."}{" "}
          <Link href="/privacidad" className="underline underline-offset-2 hover:text-ink">
            Política de privacidad
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function Campo({
  id,
  campo,
  valor,
  onChange,
}: {
  id: string;
  campo: CampoCotizador;
  valor: string;
  onChange: (v: string) => void;
}) {
  const completo = campo.ancho === "completo" || campo.tipo === "parrafo";
  const base =
    "mt-2 block w-full border-0 border-b border-ink/20 bg-transparent px-0 py-2.5 text-base text-ink placeholder:text-muted/60 focus:border-ink focus:ring-0 focus:outline-none transition-colors";
  const comun = {
    id,
    name: campo.etiqueta,
    value: valor,
    placeholder: campo.placeholder,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };
  return (
    <div className={completo ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="text-sm font-medium text-ink/80">
        {campo.etiqueta}{" "}
        <span className="font-normal text-muted/70">(opcional)</span>
      </label>
      {campo.tipo === "parrafo" ? (
        <textarea {...comun} rows={3} maxLength={800} className={`${base} resize-y`} />
      ) : (
        <input
          {...comun}
          type={campo.tipo === "correo" ? "email" : campo.tipo === "telefono" ? "tel" : "text"}
          inputMode={campo.tipo === "telefono" ? "tel" : undefined}
          autoComplete={
            campo.tipo === "correo"
              ? "email"
              : campo.tipo === "telefono"
                ? "tel"
                : /nombre/i.test(campo.etiqueta)
                  ? "name"
                  : undefined
          }
          maxLength={160}
          className={base}
        />
      )}
    </div>
  );
}
