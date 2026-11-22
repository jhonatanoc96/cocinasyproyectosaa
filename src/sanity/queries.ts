import { defineQuery } from "next-sanity";

/** Projection for every photo: asset with LQIP + dimensions, hotspot, category. */
const FOTO = /* groq */ `{
  _key, alt, descripcion, hotspot, crop,
  asset->{ _id, url, metadata { lqip, dimensions } },
  categoria->{ _id, titulo, "slug": slug.current, seccion }
}`;

const PROYECTO_RESUMEN = /* groq */ `{
  _id, titulo, "slug": slug.current, resumen,
  portada ${FOTO},
  "totalFotos": count(galeria),
  categorias[]->{ titulo, "slug": slug.current }
}`;

export const CONFIG_QUERY = defineQuery(`*[_id == "configuracion"][0]{
  ..., logo ${FOTO}, imagenCompartir ${FOTO}
}`);

export const INICIO_QUERY = defineQuery(`*[_id == "inicio"][0]{
  ...,
  heroImagenes[] ${FOTO},
  presImagen ${FOTO},
  presImagen2 ${FOTO},
  "proyectos": select(
    count(proyectos) > 0 => proyectos[]-> ${PROYECTO_RESUMEN},
    *[_type == "proyecto" && destacado == true] | order(orden asc) ${PROYECTO_RESUMEN}
  ),
  cocImagenes[] ${FOTO},
  galImagenes[] ${FOTO},
  ctaImagen ${FOTO}
}`);

export const CATEGORIAS_QUERY =
  defineQuery(`*[_type == "categoria" && seccion == $seccion] | order(orden asc){
  _id, titulo, "slug": slug.current, seccion, descripcion, imagen ${FOTO}
}`);

export const PAGINA_QUERY = defineQuery(`*[_id == $id][0]{
  ..., imagen ${FOTO}, imagenes[] ${FOTO}
}`);

export const PROYECTOS_QUERY = defineQuery(
  `*[_type == "proyecto" && defined(slug.current)] | order(orden asc) ${PROYECTO_RESUMEN}`
);

export const PROYECTOS_SLUGS_QUERY = defineQuery(
  `*[_type == "proyecto" && defined(slug.current)].slug.current`
);

export const PROYECTO_QUERY =
  defineQuery(`*[_type == "proyecto" && slug.current == $slug][0]{
  _id, titulo, "slug": slug.current, resumen, descripcion, ubicacion, anio,
  portada ${FOTO},
  "totalFotos": count(galeria),
  categorias[]->{ titulo, "slug": slug.current },
  galeria[] ${FOTO},
  videos[]{ _key, titulo, "url": archivo.asset->url, poster ${FOTO} }
}`);

/** Projects with only the photos whose category belongs to a site section. */
export const FOTOS_POR_SECCION_QUERY =
  defineQuery(`*[_type == "proyecto" && defined(slug.current)] | order(orden asc){
  _id, titulo, "slug": slug.current,
  "galeria": galeria[categoria->seccion == $seccion] ${FOTO}
}[count(galeria) > 0]`);

export const PROYECTO_VECINOS_QUERY =
  defineQuery(`*[_type == "proyecto" && defined(slug.current)] | order(orden asc){
  titulo, "slug": slug.current
}`);
