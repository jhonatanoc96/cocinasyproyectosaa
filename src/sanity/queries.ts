import { defineQuery } from "next-sanity";

/** Projection for every photo: asset with LQIP + dimensions, hotspot, category. */
const FOTO = /* groq */ `{
  _key, alt, descripcion, hotspot, crop,
  asset->{ _id, url, metadata { lqip, dimensions } },
  categoria->{ _id, titulo, "slug": slug.current, seccion }
}`;

const VIDEO = /* groq */ `{
  _key, titulo, formato,
  "url": archivo.asset->url,
  poster ${FOTO},
  categoria->{ _id, titulo, seccion }
}`;

/** Only projects marked "visible" appear on the site (hidden/archived never do). */
const VISIBLE = /* groq */ `coalesce(estado, "visible") == "visible"`;
const REF_VISIBLE = /* groq */ `coalesce(@->estado, "visible") == "visible"`;
const PROYECTO_VISIBLE = /* groq */ `_type == "proyecto" && defined(slug.current) && ${VISIBLE}`;

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
  heroSlides[]{
    _key, tipo,
    imagen ${FOTO},
    "video": video.asset->url,
    poster ${FOTO}
  },
  presImagen ${FOTO},
  presImagen2 ${FOTO},
  "proyectos": select(
    count(proyectos[${REF_VISIBLE}]) > 0 => proyectos[${REF_VISIBLE}]-> ${PROYECTO_RESUMEN},
    *[${PROYECTO_VISIBLE} && destacado == true] | order(orden asc) ${PROYECTO_RESUMEN}
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
  ..., imagen ${FOTO}, imagenes[] ${FOTO}, videos[] ${VIDEO}
}`);

export const COTIZADOR_QUERY = defineQuery(`*[_id == "cotizador"][0]{
  ..., imagen ${FOTO}
}`);

export const PROYECTOS_QUERY = defineQuery(
  `*[${PROYECTO_VISIBLE}] | order(orden asc) ${PROYECTO_RESUMEN}`
);

export const PROYECTOS_SLUGS_QUERY = defineQuery(
  `*[${PROYECTO_VISIBLE}].slug.current`
);

export const PROYECTO_QUERY =
  defineQuery(`*[${PROYECTO_VISIBLE} && slug.current == $slug][0]{
  _id, titulo, "slug": slug.current, resumen, descripcion, ubicacion, anio,
  portada ${FOTO},
  "totalFotos": count(galeria),
  categorias[]->{ titulo, "slug": slug.current },
  galeria[] ${FOTO},
  videos[] ${VIDEO}
}`);

/** Projects with only the photos whose category belongs to a site section. */
export const FOTOS_POR_SECCION_QUERY =
  defineQuery(`*[${PROYECTO_VISIBLE}] | order(orden asc){
  _id, titulo, "slug": slug.current,
  "galeria": galeria[categoria->seccion == $seccion] ${FOTO}
}[count(galeria) > 0]`);

/** Project videos whose category belongs to a site section. */
export const VIDEOS_POR_SECCION_QUERY =
  defineQuery(`*[${PROYECTO_VISIBLE}] | order(orden asc){
  titulo, "slug": slug.current,
  "videos": videos[categoria->seccion == $seccion] ${VIDEO}
}[count(videos) > 0]`);

export const PROYECTO_VECINOS_QUERY =
  defineQuery(`*[${PROYECTO_VISIBLE}] | order(orden asc){
  titulo, "slug": slug.current
}`);
