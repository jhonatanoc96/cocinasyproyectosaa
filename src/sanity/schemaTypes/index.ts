import { categoria } from "./categoria";
import { configuracion } from "./configuracion";
import { cotizador } from "./cotizador";
import { fotografia } from "./fotografia";
import { inicio } from "./inicio";
import { pagina } from "./pagina";
import { proyecto } from "./proyecto";
import { video } from "./video";

export const schemaTypes = [
  fotografia,
  video,
  categoria,
  proyecto,
  pagina,
  inicio,
  configuracion,
  cotizador,
];

/** Singleton documents: fixed IDs, no create/delete from the Studio. */
export const SINGLETONS = {
  configuracion: "configuracion",
  inicio: "inicio",
  cotizador: "cotizador",
} as const;

export const PAGINAS = [
  { id: "pagina-cocinas", title: "Cocinas" },
  { id: "pagina-mobiliario", title: "Mobiliario" },
  { id: "pagina-proyectos", title: "Proyectos" },
  { id: "pagina-nosotros", title: "Nosotros" },
  { id: "pagina-contacto", title: "Contacto" },
  { id: "pagina-terminos", title: "Términos y condiciones" },
  { id: "pagina-privacidad", title: "Política de privacidad" },
] as const;
