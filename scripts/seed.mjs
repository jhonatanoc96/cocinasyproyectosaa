/**
 * Uploads the client's real photos/videos (media/) to Sanity and creates the
 * initial content: work categories, projects with their galleries, home page,
 * inner pages, site settings, quote form and legal pages.
 * Projects, categories, home and inner pages are REPLACED; settings, quote form
 * and legal pages are only created if missing (CMS edits are kept). Idempotent: fixed document IDs + Sanity
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
        cat: "cat-closets",
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
        cat: "cat-paneles",
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

const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});
const h2 = (text) => block(text, "h2");
const h3 = (text) => block(text, "h3");
const li = (text) => ({ ...block(text), listItem: "bullet", level: 1 });
/** Paragraph with one internal link: [before, linkText, href, after]. */
const blockLink = (antes, texto, href, despues = "") => {
  const mk = key();
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [{ _type: "link", _key: mk, href }],
    children: [
      { _type: "span", _key: key(), text: antes, marks: [] },
      { _type: "span", _key: key(), text: texto, marks: [mk] },
      { _type: "span", _key: key(), text: despues, marks: [] },
    ],
  };
};
const item = (titulo, texto) => ({ _key: key(), titulo, texto });

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
    estado: "visible",
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
      formato: "vertical",
      categoria: { _type: "reference", _ref: v.cat },
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
  heroSlides: ["22", "30", "08", "29", "25"].map((n) => ({
    _type: "slide",
    _key: key(),
    tipo: "imagen",
    imagen: foto(n),
  })),
  heroIntervalo: 6,
  heroAutoplay: true,
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
    titulo: "Espacios hechos a la medida de quien los habita",
    intro:
      "Cocinas y Proyectos AA diseña y fabrica cocinas, closets y mobiliario a medida. Cada pieza se piensa para el lugar exacto donde va a vivir.",
    imagen: foto("26"),
    texto: [
      h3("Nuestra historia"),
      block(
        "Cocinas y Proyectos AA nació en [PENDIENTE: año de fundación] en [PENDIENTE: ciudad], con una idea sencilla: un buen mueble empieza por entender el espacio y a las personas que lo van a usar."
      ),
      block(
        "Hoy diseñamos y fabricamos cocinas integrales, closets y vestidores, muebles de baño, estudios, revestimientos en madera y puertas, y acompañamos cada proyecto desde la primera medida hasta la instalación final."
      ),
      block(
        "[PENDIENTE: breve reseña del equipo o de quien dirige la empresa: trayectoria, formación y lo que distingue su trabajo.]"
      ),
    ],
    imagenes: fotos(["17", "28"]),
    cifras: [
      { _key: key(), valor: "[PENDIENTE]", etiqueta: "Años de experiencia" },
      { _key: key(), valor: "[PENDIENTE]", etiqueta: "Proyectos entregados" },
      { _key: key(), valor: "100%", etiqueta: "Fabricación a medida" },
      { _key: key(), valor: "[PENDIENTE]", etiqueta: "Ciudades atendidas" },
    ],
    cita: "[PENDIENTE: frase que resuma la forma de trabajar de Cocinas y Proyectos AA.]",
    citaAutor: "[PENDIENTE: nombre y cargo]",
    procesoTitulo: "Cómo trabajamos",
    proceso: [
      item(
        "Visita y medidas",
        "Conocemos el espacio, tomamos medidas exactas y escuchamos cómo se va a usar."
      ),
      item(
        "Diseño y propuesta",
        "Definimos distribución, materiales y acabados, y presentamos una propuesta clara de alcance, tiempos y valor."
      ),
      item(
        "Fabricación",
        "Producimos cada pieza a medida [PENDIENTE: en taller propio o con aliados], cuidando cortes, cantos y herrajes."
      ),
      item(
        "Instalación y entrega",
        "Instalamos, ajustamos cada detalle y entregamos el espacio limpio y listo para usar."
      ),
    ],
    valoresTitulo: "Nuestro compromiso",
    valores: [
      item(
        "Medida exacta",
        "Cada mueble se diseña para el lugar donde va a vivir: de piso a techo y sin espacios desperdiciados."
      ),
      item(
        "Materiales y herrajes",
        "[PENDIENTE: materiales y marcas de herrajes con los que se trabaja, por ejemplo tableros, enchapes y bisagras de cierre lento.]"
      ),
      item("Garantía", "[PENDIENTE: tiempo y condiciones de la garantía.]"),
      item(
        "Cumplimiento",
        "[PENDIENTE: compromiso de tiempos de entrega y forma de seguimiento del proyecto.]"
      ),
    ],
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

// ── Legal pages (created once; later edits in the CMS are kept) ─────────────
const IDENTIFICACION =
  "Cocinas y Proyectos AA ([PENDIENTE: razón social]), identificada con NIT [PENDIENTE], con domicilio en [PENDIENTE: dirección y ciudad], correo electrónico [PENDIENTE] y teléfono [PENDIENTE].";

tx.createIfNotExists({
  _id: "pagina-privacidad",
  _type: "pagina",
  etiqueta: "Legal",
  titulo: "Política de privacidad y tratamiento de datos personales",
  actualizado: "2026-11-22",
  intro:
    "Esta política explica cómo Cocinas y Proyectos AA recolecta, usa y protege los datos personales de quienes visitan este sitio o solicitan una cotización.",
  texto: [
    h2("1. Responsable del tratamiento"),
    block(IDENTIFICACION),
    h2("2. Marco legal"),
    block(
      "Esta política se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y las demás normas colombianas sobre protección de datos personales."
    ),
    h2("3. Datos que recolectamos"),
    block(
      "Cocinas y Proyectos AA solo trata los datos que el titular entrega de forma libre y voluntaria:"
    ),
    li(
      "Datos del formulario de cotización: nombre, teléfono, correo electrónico, ciudad o barrio, medidas aproximadas y el mensaje que el titular decida escribir. Ninguno de estos campos es obligatorio."
    ),
    li(
      "Datos que el titular comparta por WhatsApp, teléfono o correo durante la conversación, como fotografías o planos del espacio."
    ),
    li(
      "Datos técnicos mínimos de navegación (dirección IP, tipo de navegador y fecha de acceso) que el servidor registra por seguridad y funcionamiento del sitio."
    ),
    block(
      "El formulario de cotización no guarda información en este sitio: al continuar, los datos se incluyen en un mensaje de WhatsApp que el titular revisa y decide enviar. Este sitio no usa cookies de publicidad ni de seguimiento."
    ),
    h2("4. Finalidades del tratamiento"),
    li("Responder solicitudes de información y cotización."),
    li("Coordinar visitas, tomar medidas y elaborar propuestas de diseño."),
    li("Ejecutar, hacer seguimiento y dar garantía a los proyectos contratados."),
    li("Cumplir obligaciones legales, contables y tributarias."),
    li(
      "Enviar información comercial sobre productos y servicios, únicamente cuando el titular lo haya autorizado."
    ),
    h2("5. Servicios de terceros"),
    block(
      "Las conversaciones por WhatsApp se realizan a través de un servicio de un tercero (WhatsApp, de Meta Platforms). El tratamiento que ese servicio hace de los datos se rige por sus propias políticas de privacidad."
    ),
    h2("6. Derechos del titular"),
    block("De acuerdo con la ley, el titular de los datos puede:"),
    li("Conocer, actualizar y rectificar sus datos personales."),
    li("Solicitar prueba de la autorización otorgada."),
    li("Ser informado sobre el uso que se ha dado a sus datos."),
    li(
      "Revocar la autorización o solicitar la supresión de sus datos cuando no exista un deber legal o contractual de conservarlos."
    ),
    li("Acceder de forma gratuita a sus datos personales."),
    li(
      "Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley."
    ),
    h2("7. Consultas y reclamos"),
    block(
      "Para ejercer sus derechos, el titular puede escribir a [PENDIENTE: correo electrónico para datos personales], indicando su nombre, la solicitud y un medio de contacto."
    ),
    block(
      "Las consultas se responden en un plazo máximo de diez (10) días hábiles y los reclamos en un plazo máximo de quince (15) días hábiles, prorrogables en los términos de la Ley 1581 de 2012."
    ),
    h2("8. Seguridad y conservación"),
    block(
      "Cocinas y Proyectos AA adopta medidas razonables para proteger los datos contra acceso, uso o divulgación no autorizados. Los datos se conservan durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales: [PENDIENTE: plazo de conservación]."
    ),
    h2("9. Menores de edad"),
    block(
      "Este sitio no está dirigido a menores de edad y Cocinas y Proyectos AA no recolecta intencionalmente datos de menores."
    ),
    h2("10. Vigencia y cambios"),
    block(
      "Esta política rige desde el [PENDIENTE: fecha de entrada en vigencia]. Cualquier cambio se publicará en esta página con su fecha de actualización."
    ),
  ],
});

tx.createIfNotExists({
  _id: "pagina-terminos",
  _type: "pagina",
  etiqueta: "Legal",
  titulo: "Términos y condiciones de uso",
  actualizado: "2026-11-22",
  intro:
    "Estos términos regulan el uso del sitio web de Cocinas y Proyectos AA. Al navegarlo o solicitar una cotización, el usuario los acepta.",
  texto: [
    h2("1. Identificación"),
    block(`Este sitio web es operado por ${IDENTIFICACION}`),
    h2("2. Objeto del sitio"),
    block(
      "El sitio presenta los servicios y trabajos realizados por Cocinas y Proyectos AA y permite solicitar cotizaciones de cocinas, mobiliario y proyectos a medida."
    ),
    h2("3. Cotizaciones"),
    block(
      "Las solicitudes enviadas desde el sitio o por WhatsApp no constituyen una oferta ni un contrato. Los valores, plazos, materiales y condiciones de cada proyecto se definen en una propuesta escrita, normalmente después de una visita y toma de medidas."
    ),
    block("Vigencia de las cotizaciones: [PENDIENTE: número de días]."),
    h2("4. Imágenes y referencias"),
    block(
      "Las fotografías y videos corresponden a proyectos realizados por Cocinas y Proyectos AA y se muestran como referencia. Los colores y texturas pueden variar según la pantalla y el lote de los materiales. Cada proyecto se diseña y fabrica a la medida de su espacio."
    ),
    h2("5. Propiedad intelectual"),
    block(
      "La marca, el logotipo, los textos, las fotografías, los videos y el diseño de este sitio pertenecen a Cocinas y Proyectos AA o se usan con autorización. No pueden reproducirse, distribuirse ni modificarse sin autorización previa y por escrito."
    ),
    h2("6. Uso adecuado"),
    block(
      "El usuario se compromete a usar el sitio de forma lícita y a no realizar acciones que afecten su funcionamiento, su seguridad o los derechos de terceros."
    ),
    h2("7. Enlaces a terceros"),
    block(
      "El sitio incluye enlaces a servicios de terceros, como WhatsApp y redes sociales. Cocinas y Proyectos AA no controla ni se hace responsable del contenido ni de las políticas de esos servicios."
    ),
    h2("8. Garantía de los trabajos"),
    block(
      "Las condiciones de garantía de cada proyecto se establecen en la propuesta o contrato correspondiente, de acuerdo con el Estatuto del Consumidor (Ley 1480 de 2011): [PENDIENTE: condiciones generales de garantía]."
    ),
    h2("9. Responsabilidad"),
    block(
      "Cocinas y Proyectos AA procura que la información del sitio sea precisa y esté actualizada, pero no garantiza que esté libre de errores ni que el sitio esté disponible de forma ininterrumpida."
    ),
    h2("10. Datos personales"),
    blockLink(
      "El tratamiento de los datos personales se rige por la ",
      "Política de privacidad",
      "/privacidad",
      " de Cocinas y Proyectos AA."
    ),
    h2("11. Ley aplicable"),
    block(
      "Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se someterá a los jueces competentes de [PENDIENTE: ciudad]."
    ),
    h2("12. Cambios a estos términos"),
    block(
      "Cocinas y Proyectos AA puede actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página."
    ),
  ],
});

// ── Quote form (created once; later edits in the CMS are kept) ──────────────
const campo = (etiqueta, tipo, placeholder, ancho = "medio") => ({
  _type: "campo",
  _key: key(),
  etiqueta,
  tipo,
  placeholder,
  ancho,
});
tx.createIfNotExists({
  _id: "cotizador",
  _type: "cotizador",
  etiqueta: "Cotización",
  titulo: "Cotice su proyecto",
  intro:
    "Cuéntenos qué quiere hacer. Con estos datos preparamos su mensaje de WhatsApp para responderle lo antes posible.",
  imagen: foto("15"),
  etiquetaTipo: "¿Qué quiere cotizar?",
  opcionCocina: "Cocina",
  opcionMobiliario: "Mobiliario",
  opcionGeneral: "Otro proyecto",
  textoBoton: "Continuar en WhatsApp",
  nota: "Ningún dato es obligatorio. Al continuar se abre WhatsApp con su mensaje listo para enviar; nada se guarda en este sitio.",
  mensajeGeneral: "Hola, quiero cotizar un proyecto con Cocinas y Proyectos AA.",
  mensajeCocina:
    "Hola, quiero cotizar una cocina a medida con Cocinas y Proyectos AA.",
  mensajeMobiliario:
    "Hola, quiero cotizar mobiliario a medida (closet, vestidor, mueble de baño u otro) con Cocinas y Proyectos AA.",
  mensajeProyecto:
    'Hola, vi el proyecto "{proyecto}" en su sitio web y quiero cotizar algo similar.',
  encabezadoDatos: "Mis datos:",
  campos: [
    campo("Nombre", "texto", "Su nombre"),
    campo("Teléfono", "telefono", "Para devolverle la llamada"),
    campo("Correo", "correo", "nombre@correo.com"),
    campo("Ciudad o barrio", "texto", "¿Dónde está el espacio?"),
    campo("Medidas aproximadas", "texto", "Ej: cocina en L de 3 × 2,5 m", "completo"),
    campo("Mensaje", "parrafo", "Cuéntenos qué tiene en mente", "completo"),
  ],
});


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

// Contact fields the client still has to provide: shown as "[PENDIENTE]" in
// the footer and contact page until replaced in "Configuración del sitio".
await client
  .patch("configuracion")
  .setIfMissing({
    descripcion:
      "Diseño y fabricación de cocinas integrales, closets, vestidores y mobiliario a medida.",
    telefono: "[PENDIENTE]",
    email: "[PENDIENTE]",
    direccion: "[PENDIENTE]",
    ciudad: "[PENDIENTE]",
    horario: "[PENDIENTE]",
    nit: "[PENDIENTE]",
  })
  .commit();
console.log(
  `Listo: ${Object.keys(FOTOS).length} fotos, ${
    Object.keys(videoAssets).length
  } videos, ${PROYECTOS.length} proyectos.`
);
