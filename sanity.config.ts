"use client";

import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { HomeIcon } from "@sanity/icons/Home";
import { TagIcon } from "@sanity/icons/Tag";
import { ImagesIcon } from "@sanity/icons/Images";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { PAGINAS, SINGLETONS, schemaTypes } from "./src/sanity/schemaTypes";

const singletonTypes = new Set<string>(["configuracion", "inicio"]);
const fixedIds = new Set<string>([
  ...Object.values(SINGLETONS),
  ...PAGINAS.map((p) => p.id),
]);

const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Página de inicio")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("inicio")
            .documentId(SINGLETONS.inicio)
            .title("Página de inicio")
        ),
      S.listItem()
        .title("Proyectos y galerías")
        .icon(ImagesIcon)
        .child(
          S.documentTypeList("proyecto")
            .title("Proyectos")
            .defaultOrdering([{ field: "orden", direction: "asc" }])
        ),
      S.listItem()
        .title("Tipos de trabajo")
        .icon(TagIcon)
        .child(
          S.documentTypeList("categoria")
            .title("Tipos de trabajo")
            .defaultOrdering([{ field: "orden", direction: "asc" }])
        ),
      S.divider(),
      S.listItem()
        .title("Páginas")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Páginas")
            .items(
              PAGINAS.map((p) =>
                S.listItem()
                  .title(p.title)
                  .icon(DocumentIcon)
                  .child(
                    S.document()
                      .schemaType("pagina")
                      .documentId(p.id)
                      .title(p.title)
                  )
              )
            )
        ),
      S.divider(),
      S.listItem()
        .title("Configuración del sitio")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("configuracion")
            .documentId(SINGLETONS.configuracion)
            .title("Configuración del sitio")
        ),
    ]);

export default defineConfig({
  name: "cocinas-y-proyectos-aa",
  title: "Cocinas y Proyectos AA",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons and fixed pages can't be created from the global "+" menu.
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) =>
          !singletonTypes.has(schemaType) && schemaType !== "pagina"
      ),
  },
  document: {
    actions: (actions, { documentId }) =>
      documentId && fixedIds.has(documentId.replace(/^drafts\./, ""))
        ? actions.filter(
            ({ action }) =>
              action !== "delete" &&
              action !== "duplicate" &&
              action !== "unpublish"
          )
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
