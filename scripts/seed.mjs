/**
 * Uploads the client's real photos/videos (media/) to Sanity and creates the
 * initial content: work categories, projects with their galleries, home page,
 * inner pages and site settings. Idempotent: fixed document IDs + Sanity
 * de-duplicates assets by hash, so it can be re-run safely.
 *
 *   SANITY_WRITE_TOKEN=... npm run seed
 *
 * Note: foto-19 is a handwritten price note, not a finished job — it is NOT
 * uploaded or published on purpose.
 */
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.join(root, ".env.local"), quiet: true });

const token = process.env.SANITY_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (!token) throw new Error("Define SANITY_WRITE_TOKEN en .env.local");
if (!projectId || !dataset)
  throw new Error("Define NEXT_PUBLIC_SANITY_PROJECT_ID y NEXT_PUBLIC_SANITY_DATASET en .env.local");
console.log(`Destino: proyecto ${projectId} · dataset ${dataset}`);

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-10-01",
  token,
  useCdn: false,
});

// ── Work categories ─────────────────────────────────────────────────────────
const CATEGORIAS = [
  {
    id: "cat-cocinas",
    titulo: "Cocinas",
    slug: "cocinas",
    seccion: "cocinas",
    orden: 1,
    descripcion:
      "Cocinas integrales, muebles altos y torres de electrodomésticos fabricados a medida.",
  },
  {
    id: "cat-closets",
    titulo: "Closets y vestidores",
    slug: "closets-y-vestidores",
    seccion: "mobiliario",
    orden: 2,
    descripcion:
      "Closets de puertas corredizas, vestidores abiertos, cajoneras, zapateros y entrepaños.",
  },
  {
    id: "cat-banos",
    titulo: "Muebles de baño",
    slug: "muebles-de-bano",
    seccion: "mobiliario",
    orden: 3,
    descripcion: "Muebles de lavamanos flotantes y gabinetes superiores.",
  },
  {
    id: "cat-paneles",
    titulo: "Paneles y muebles de TV",
    slug: "paneles-y-muebles-de-tv",
    seccion: "mobiliario",
    orden: 4,
    descripcion:
      "Revestimientos de muro, cielos en madera, paneles con nichos y muebles bajos.",
  },
  {
    id: "cat-estudios",
    titulo: "Estudios y bibliotecas",
    slug: "estudios-y-bibliotecas",
    seccion: "mobiliario",
    orden: 5,
    descripcion: "Escritorios empotrados, bibliotecas y repisas.",
  },
  {
    id: "cat-puertas",
    titulo: "Puertas",
    slug: "puertas",
    seccion: "mobiliario",
    orden: 6,
    descripcion: "Puertas en madera a la medida del espacio.",
  },
];

// ── Photo catalogue (from analysing every photo) ────────────────────────────
// hs = hotspot to keep the subject in frame when the photo is cropped.
const FOTOS = {
  "01": {
    cat: "cat-closets",
    alt: "Closet de cuatro puertas corredizas en madera clara de piso a techo",
  },
  "02": {
    cat: "cat-banos",
    alt: "Mueble de lavamanos flotante y gabinete superior en madera clara",
  },
  "03": {
    cat: "cat-banos",
    alt: "Mueble de baño flotante con dos puertas y gabinete superior",
  },
  "04": {
    cat: "cat-banos",
    alt: "Conjunto de mueble de lavamanos y gabinete superior en baño con enchape gris",
  },
  "05": {
    cat: "cat-closets",
    alt: "Closet con puerta corrediza abierta, entrepaños, cajón y tubo para colgar",
  },
  "06": {
    cat: "cat-banos",
    alt: "Vista frontal de mueble de lavamanos y gabinete superior en madera",
  },
  "07": {
    cat: "cat-closets",
    alt: "Closet de puerta corrediza en madera clara con entrepaños y cajón interior",
  },
  "08": {
    cat: "cat-closets",
    alt: "Closet corredizo en madera clara de piso a techo, abierto mostrando entrepaños",
  },
  "09": {
    cat: "cat-closets",
    alt: "Closet de dos puertas corredizas cerradas en madera clara",
  },
  10: {
    cat: "cat-banos",
    alt: "Mueble de lavamanos flotante de dos puertas en madera, baño terminado",
  },
  11: {
    cat: "cat-closets",
    alt: "Closet de puertas corredizas en madera clara junto a ventana",
  },
  12: {
    cat: "cat-puertas",
    alt: "Puerta en madera tono nogal con diseño de vetas cruzadas",
  },
  13: {
    cat: "cat-closets",
    alt: "Closet corredizo con maletero superior y tubos para colgar",
  },
  14: {
    cat: "cat-closets",
    alt: "Zapatero de entrepaños inclinados en vestidor color arena",
  },
  15: {
    cat: "cat-cocinas",
    alt: "Cocina con torres de piso a techo color arena, horno empotrado y mesón bajo ventana",
  },
  16: {
    cat: "cat-paneles",
    alt: "Panel de muro en madera nogal con nicho central",
  },
  17: {
    cat: "cat-closets",
    alt: "Vestidor en nogal con cajones, entrepaños y puerta corrediza",
  },
  18: {
    cat: "cat-closets",
    alt: "Vestidor abierto con zapatero, entrepaños y cajonera gris",
  },
  20: {
    cat: "cat-closets",
    alt: "Pasillo vestidor con muebles color arena y entrepaños abiertos",
  },
  21: {
    cat: "cat-estudios",
    alt: "Escritorio empotrado con repisas laterales en tono arena",
  },
  22: {
    cat: "cat-closets",
    alt: "Vestidor en nogal oscuro con iluminación LED integrada en los entrepaños",
  },
  23: {
    cat: "cat-estudios",
    alt: "Estudio en tono grafito con biblioteca, escritorio y columna con vitrina",
  },
  24: {
    cat: "cat-paneles",
    alt: "Muro panelado en grafito con nicho para TV y mueble bajo",
  },
  25: {
    cat: "cat-paneles",
    alt: "Zona social con cielo curvo y muros revestidos en madera nogal",
    hs: { x: 0.45, y: 0.4 },
  },
  26: {
    cat: "cat-closets",
    alt: "Vestidor con cajonera, entrepaños y módulos altos en tono arena",
  },
  27: {
    cat: "cat-cocinas",
    alt: "Cocina en L color arena con mesón bajo ventana y puerta de despensa",
  },
  28: {
    cat: "cat-paneles",
    alt: "Muro en madera nogal con repisas empotradas",
  },
  29: {
    cat: "cat-cocinas",
    alt: "Torres de cocina color arena con vinera integrada",
    hs: { x: 0.5, y: 0.55 },
  },
  30: {
    cat: "cat-cocinas",
    alt: "Cocina con torres de piso a techo, horno empotrado y lavaplatos bajo ventana",
    hs: { x: 0.6, y: 0.4 },
  },
};

// ── Projects (grouped by what the photos visibly share; editable in the CMS) ─
const PROYECTOS = [
  {
    id: "proyecto-cocina-arena",
    slug: "cocina-integral-tonos-arena",
    orden: 1,
    destacado: true,
    titulo: "Cocina integral en tonos arena",
    resumen: "Torres de piso a techo, horno empotrado y vinera integrada.",
    descripcion: [
      "Cocina en L con muebles bajos sin tiradores y torres de piso a techo que integran horno y electrodomésticos.",
      "El conjunto se completa con un módulo de torres con vinera integrada hacia la zona social.",
    ],
    portada: "30",
    fotos: ["30", "15", "27", "29"],
    cats: ["cat-cocinas"],
  },
  {
    id: "proyecto-vestidores-nogal",
    slug: "vestidores-nogal-y-arena",
    orden: 2,
    destacado: true,
    titulo: "Vestidores en nogal y arena",
    resumen: "Vestidores abiertos, zapateros, cajoneras e iluminación LED.",
    descripcion: [
      "Vestidores y closets con entrepaños, cajoneras, zapateros de bandejas inclinadas y tubos para colgar.",
      "En el vestidor en nogal, la iluminación LED se integra en los entrepaños.",
    ],
    portada: "22",
    fotos: ["22", "17", "18", "26", "14", "20"],
    videos: [
      {
        file: "video-01.mp4",
        poster: "video-01-poster.png",
        titulo: "Recorrido por el vestidor",
      },
    ],
    cats: ["cat-closets"],
  },
  {
    id: "proyecto-zona-social-nogal",
    slug: "zona-social-paneles-en-nogal",
    orden: 3,
    destacado: true,
    titulo: "Zona social con paneles en nogal",
    resumen: "Cielo curvo, muros revestidos en madera, repisas y puertas.",
    descripcion: [
      "Revestimiento en madera nogal para muros y cielo curvo de la zona social, con repisas empotradas y nichos.",
    ],
    portada: "25",
    fotos: ["25", "28", "16", "12"],
    videos: [
      {
        file: "video-02.mp4",
        poster: "video-02-poster.png",
        titulo: "Detalle del cielo en madera",
      },
    ],
    cats: ["cat-paneles", "cat-puertas"],
  },
  {
    id: "proyecto-closets-madera-clara",
    slug: "closets-corredizos-madera-clara",
    orden: 4,
    destacado: true,
    titulo: "Closets corredizos en madera clara",
    resumen:
      "Closets de piso a techo con puertas corredizas y distribución interior a medida.",
    descripcion: [
      "Closets de puertas corredizas en madera clara, de piso a techo, con entrepaños, cajón interior, maletero y tubos para colgar.",
    ],
    portada: "08",
    fotos: ["08", "07", "09", "05", "13", "11", "01"],
    cats: ["cat-closets"],
  },
  {
    id: "proyecto-estudio-grafito",
    slug: "estudio-y-mueble-de-tv-grafito",
    orden: 5,
    destacado: false,
    titulo: "Estudio y mueble de TV en grafito",
    resumen:
      "Biblioteca, escritorio empotrado y muro panelado con nicho para TV.",
    descripcion: [
      "Estudio con biblioteca y escritorio empotrado, y muro panelado en tono grafito con nicho para TV y mueble bajo.",
    ],
    portada: "23",
    fotos: ["23", "24", "21"],
    cats: ["cat-estudios", "cat-paneles"],
  },
  {
    id: "proyecto-banos-flotantes",
    slug: "muebles-de-bano-flotantes",
    orden: 6,
    destacado: false,
    titulo: "Muebles de baño flotantes",
    resumen: "Mueble de lavamanos flotante con gabinete superior a juego.",
    descripcion: [
      "Mueble de lavamanos flotante de dos puertas y gabinete superior en el mismo acabado de madera.",
    ],
    portada: "10",
    fotos: ["10", "02", "03", "04", "06"],
    cats: ["cat-banos"],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
const assetIds = {};
let keyN = 0;
const key = () =>
  `k${(++keyN).toString(36)}${Math.random().toString(36).slice(2, 7)}`;

async function upload(kind, file) {
  const asset = await client.assets.upload(kind, createReadStream(file), {
    filename: path.basename(file),
  });
  return asset._id;
}

function foto(n, withKey = false) {
  const f = FOTOS[n];
  const img = {
    _type: "fotografia",
    asset: { _type: "reference", _ref: assetIds[n] },
    alt: f.alt,
    categoria: { _type: "reference", _ref: f.cat },
    ...(f.hs
      ? {
          hotspot: {
            _type: "sanity.imageHotspot",
            x: f.hs.x,
            y: f.hs.y,
            width: 1,
            height: 1,
          },
        }
      : {}),
  };
  return withKey ? { _key: key(), ...img } : img;
}
const fotos = (list) => list.map((n) => foto(n, true));

const block = (text) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

// ── Run ─────────────────────────────────────────────────────────────────────
console.log("Subiendo fotografías…");
for (const n of Object.keys(FOTOS)) {
  assetIds[n] = await upload(
    "image",
    path.join(root, "media/fotos", `foto-${n}.jpg`)
  );
  process.stdout.write(`  foto-${n} ✓\n`);
}

console.log("Subiendo videos…");
const videoAssets = {};
for (const p of PROYECTOS) {
  for (const v of p.videos ?? []) {
    videoAssets[v.file] = {
      file: await upload("file", path.join(root, "media/videos", v.file)),
      poster: await upload("image", path.join(root, "media/videos", v.poster)),
    };
    process.stdout.write(`  ${v.file} ✓\n`);
  }
}

const tx = client.transaction();

for (const c of CATEGORIAS) {
  const repr = {
    "cat-cocinas": "30",
    "cat-closets": "22",
    "cat-banos": "10",
    "cat-paneles": "24",
    "cat-estudios": "23",
    "cat-puertas": "12",
  }[c.id];
  tx.createOrReplace({
    _id: c.id,
    _type: "categoria",
    titulo: c.titulo,
    slug: { _type: "slug", current: c.slug },
    seccion: c.seccion,
    descripcion: c.descripcion,
    orden: c.orden,
    imagen: foto(repr),
  });
}

for (const p of PROYECTOS) {
  tx.createOrReplace({
    _id: p.id,
    _type: "proyecto",
    titulo: p.titulo,
    slug: { _type: "slug", current: p.slug },
    resumen: p.resumen,
    descripcion: p.descripcion.map(block),
    orden: p.orden,
    destacado: p.destacado,
    portada: foto(p.portada),
    galeria: fotos(p.fotos),
    categorias: p.cats.map((ref) => ({
      _type: "reference",
      _ref: ref,
      _key: key(),
    })),
    videos: (p.videos ?? []).map((v) => ({
      _type: "video",
      _key: key(),
      titulo: v.titulo,
      archivo: {
        _type: "file",
        asset: { _type: "reference", _ref: videoAssets[v.file].file },
      },
      poster: {
        _type: "image",
        asset: { _type: "reference", _ref: videoAssets[v.file].poster },
      },
    })),
  });
}

tx.createOrReplace({
  _id: "inicio",
  _type: "inicio",
  heroEtiqueta: "Diseño y fabricación a medida",
  heroTitulo: "Cocinas y mobiliario hechos para su espacio.",
  heroTexto:
    "Cocinas integrales, closets, vestidores y carpintería arquitectónica fabricados a la medida.",
  heroImagenes: fotos(["22", "30", "08", "29", "25"]),
  presEtiqueta: "Cocinas y Proyectos AA",
  presTitulo:
    "Cada mueble se diseña y fabrica para el lugar exacto donde va a vivir.",
  presTexto:
    "Diseñamos y fabricamos cocinas, closets, vestidores, muebles de baño y revestimientos en madera. Trabajamos a la medida de cada espacio: de piso a techo, con la distribución interior que cada proyecto necesita.",
  presImagen: foto("29"),
  presImagen2: foto("18"),
  proyTitulo: "Proyectos destacados",
  proyTexto: "Una selección de trabajos realizados, documentados en obra.",
  cocTitulo: "Cocinas",
  cocTexto:
    "Cocinas integrales con torres de piso a techo, electrodomésticos empotrados y frentes sin tiradores. Cada módulo se fabrica según las medidas del espacio.",
  cocImagenes: fotos(["30", "27", "29", "15"]),
  mobTitulo: "Mobiliario y proyectos especiales",
  mobTexto:
    "Closets, vestidores, muebles de baño, estudios y revestimientos en madera.",
  difTitulo: "Por qué elegirnos",
  diferenciales: [],
  galTitulo: "Galería",
  galImagenes: fotos([
    "18",
    "07",
    "16",
    "26",
    "24",
    "13",
    "27",
    "17",
    "28",
    "05",
    "21",
    "02",
  ]),
  ctaTitulo: "Cotice su proyecto",
  ctaTexto:
    "Cuéntenos qué espacio quiere transformar y le ayudamos a definirlo.",
  ctaBoton: "Cotizar por WhatsApp",
  ctaImagen: foto("25"),
});

const paginas = [
  {
    id: "pagina-cocinas",
    etiqueta: "Cocinas",
    titulo: "Cocinas a la medida",
    intro:
      "Cocinas integrales con torres de piso a techo, electrodomésticos empotrados y frentes sin tiradores.",
    imagen: foto("30"),
  },
  {
    id: "pagina-mobiliario",
    etiqueta: "Mobiliario",
    titulo: "Mobiliario y proyectos especiales",
    intro:
      "Closets, vestidores, muebles de baño, estudios, paneles y puertas fabricados a la medida del espacio.",
    imagen: foto("22"),
  },
  {
    id: "pagina-proyectos",
    etiqueta: "Proyectos",
    titulo: "Proyectos realizados",
    intro:
      "Cada proyecto con su galería completa de fotografías y videos de obra.",
    imagen: foto("25"),
  },
  {
    id: "pagina-nosotros",
    etiqueta: "Nosotros",
    titulo: "Diseño y fabricación a medida",
    intro:
      "Cocinas y Proyectos AA diseña y fabrica cocinas, closets y mobiliario a la medida de cada espacio.",
    imagen: foto("26"),
    texto: [
      block(
        "Nuestro trabajo abarca cocinas integrales, closets y vestidores, muebles de baño, estudios, revestimientos en madera y puertas."
      ),
      block(
        "Cada proyecto se fabrica según las medidas y necesidades del espacio, con la distribución interior que el cliente requiere."
      ),
    ],
    imagenes: fotos(["17", "28"]),
  },
  {
    id: "pagina-contacto",
    etiqueta: "Contacto",
    titulo: "Hablemos de su proyecto",
    intro:
      "Escríbanos por WhatsApp con las medidas o fotos de su espacio y le ayudamos a definir el proyecto.",
    imagen: foto("17"),
  },
];
for (const pg of paginas)
  tx.createOrReplace({ _type: "pagina", ...pg, _id: pg.id });

tx.createIfNotExists({
  _id: "configuracion",
  _type: "configuracion",
  nombre: "Cocinas y Proyectos AA",
  eslogan: "Diseño y fabricación a medida",
  mensajeWhatsapp:
    "Hola, quiero cotizar un proyecto con Cocinas y Proyectos AA.",
  seoDescripcion:
    "Cocinas y Proyectos AA: diseño y fabricación de cocinas integrales, closets, vestidores, muebles de baño y carpintería a medida.",
  imagenCompartir: {
    _type: "image",
    asset: { _type: "reference", _ref: assetIds["30"] },
  },
});

await tx.commit();
console.log(
  `Listo: ${Object.keys(FOTOS).length} fotos, ${
    Object.keys(videoAssets).length
  } videos, ${PROYECTOS.length} proyectos.`
);
