import { categoria } from "./categoria";
import { configuracion } from "./configuracion";
import { fotografia } from "./fotografia";
import { inicio } from "./inicio";
import { pagina } from "./pagina";
import { proyecto } from "./proyecto";

export const schemaTypes = [
  fotografia,
  categoria,
  proyecto,
  pagina,
  inicio,
  configuracion,
];

/** Singleton documents: fixed IDs, no create/delete from the Studio. */
export const SINGLETONS = {
  configuracion: "configuracion",
  inicio: "inicio",
} as const;

export const PAGINAS = [
  { id: "pagina-cocinas", title: "Cocinas" },
  { id: "pagina-mobiliario", title: "Mobiliario" },
  { id: "pagina-proyectos", title: "Proyectos" },
  { id: "pagina-nosotros", title: "Nosotros" },
  { id: "pagina-contacto", title: "Contacto" },
] as const;
