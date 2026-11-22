import { sanityFetch } from "./client";
import {
  CATEGORIAS_QUERY,
  CONFIG_QUERY,
  FOTOS_POR_SECCION_QUERY,
  INICIO_QUERY,
  PAGINA_QUERY,
  PROYECTO_QUERY,
  PROYECTO_VECINOS_QUERY,
  PROYECTOS_QUERY,
  PROYECTOS_SLUGS_QUERY,
} from "./queries";
import type {
  Categoria,
  Configuracion,
  Inicio,
  Pagina,
  Proyecto,
  ProyectoConFotos,
  ProyectoResumen,
} from "./types";

const FALLBACK_CONFIG: Configuracion = { nombre: "Cocinas y Proyectos AA" };

export async function getConfig(): Promise<Configuracion> {
  return (
    (await sanityFetch<Configuracion | null>(CONFIG_QUERY)) ?? FALLBACK_CONFIG
  );
}

export async function getInicio(): Promise<Inicio> {
  return (await sanityFetch<Inicio | null>(INICIO_QUERY)) ?? {};
}

export async function getPagina(id: string): Promise<Pagina | null> {
  return sanityFetch<Pagina | null>(PAGINA_QUERY, { id });
}

export async function getCategorias(
  seccion: "cocinas" | "mobiliario"
): Promise<Categoria[]> {
  return sanityFetch<Categoria[]>(CATEGORIAS_QUERY, { seccion });
}

export async function getProyectos(): Promise<ProyectoResumen[]> {
  return sanityFetch<ProyectoResumen[]>(PROYECTOS_QUERY);
}

export async function getProyectoSlugs(): Promise<string[]> {
  return sanityFetch<string[]>(PROYECTOS_SLUGS_QUERY);
}

export async function getProyecto(slug: string): Promise<Proyecto | null> {
  return sanityFetch<Proyecto | null>(PROYECTO_QUERY, { slug });
}

export async function getProyectoVecinos(): Promise<
  { titulo: string; slug: string }[]
> {
  return sanityFetch<{ titulo: string; slug: string }[]>(
    PROYECTO_VECINOS_QUERY
  );
}

export async function getFotosPorSeccion(
  seccion: "cocinas" | "mobiliario"
): Promise<ProyectoConFotos[]> {
  return sanityFetch<ProyectoConFotos[]>(FOTOS_POR_SECCION_QUERY, { seccion });
}
