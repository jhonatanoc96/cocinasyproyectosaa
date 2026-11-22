"use client";

import { defineConfig, type DocumentBadgeComponent } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { ArchiveIcon } from "@sanity/icons/Archive";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { EyeClosedIcon } from "@sanity/icons/EyeClosed";
import { HomeIcon } from "@sanity/icons/Home";
import { ImagesIcon } from "@sanity/icons/Images";
import { TagIcon } from "@sanity/icons/Tag";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { PAGINAS, SINGLETONS, schemaTypes } from "./src/sanity/schemaTypes";

const singletonTypes = new Set<string>(Object.keys(SINGLETONS));
const fixedIds = new Set<string>([
  ...Object.values(SINGLETONS),
  ...PAGINAS.map((p) => p.id),
]);

const singleton = (
  S: Parameters<StructureResolver>[0],
  id: keyof typeof SINGLETONS,
  title: string,
  icon: typeof CogIcon
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(id).documentId(SINGLETONS[id]).title(title));

const proyectosPorEstado = (
  S: Parameters<StructureResolver>[0],
  title: string,
  estado: "visible" | "oculto" | "archivado",
  icon: typeof CogIcon
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentList()
        .title(title)
        .schemaType("proyecto")
        .filter('_type == "proyecto" && coalesce(estado, "visible") == $estado')
        .params({ estado })
        .defaultOrdering([{ field: "orden", direction: "asc" }])
        .initialValueTemplates([
          S.initialValueTemplateItem("proyecto-con-estado", { estado }),
        ])
    );

const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      singleton(S, "inicio", "Página de inicio", HomeIcon),
      S.listItem()
        .title("Proyectos y galerías")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Proyectos")
            .items([
              proyectosPorEstado(S, "Visibles en el sitio", "visible", ImagesIcon),
              proyectosPorEstado(S, "Ocultos", "oculto", EyeClosedIcon),
              proyectosPorEstado(S, "Archivados", "archivado", ArchiveIcon),
              S.divider(),
              S.listItem()
                .title("Todos los proyectos")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("proyecto")
                    .title("Todos los proyectos")
                    .defaultOrdering([{ field: "orden", direction: "asc" }])
                ),
            ])
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
      singleton(S, "cotizador", "Cotizador (formulario y WhatsApp)", EnvelopeIcon),
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
      singleton(S, "configuracion", "Configuración del sitio", CogIcon),
    ]);

/** Badge in the document header so the project's visibility is obvious. */
const EstadoBadge: DocumentBadgeComponent = ({ draft, published }) => {
  const estado = (draft ?? published)?.estado as string | undefined;
  if (estado === "oculto") return { label: "Oculto", color: "warning" };
  if (estado === "archivado") return { label: "Archivado", color: "danger" };
  return { label: "Visible", color: "success" };
};

export default defineConfig({
  name: "cocinas-y-proyectos-aa",
  title: "Cocinas y Proyectos AA",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      // Singletons and fixed pages can't be created from the global "+" menu.
      ...templates.filter(
        ({ schemaType }) =>
          !singletonTypes.has(schemaType) && schemaType !== "pagina"
      ),
      {
        id: "proyecto-con-estado",
        title: "Proyecto",
        schemaType: "proyecto",
        parameters: [{ name: "estado", type: "string" }],
        value: (params: { estado?: string }) => ({
          estado: params?.estado ?? "visible",
        }),
      },
    ],
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((t) => t.templateId !== "proyecto-con-estado"),
    actions: (actions, { documentId }) =>
      documentId && fixedIds.has(documentId.replace(/^drafts\./, ""))
        ? actions.filter(
            ({ action }) =>
              action !== "delete" &&
              action !== "duplicate" &&
              action !== "unpublish"
          )
        : actions,
    badges: (badges, { schemaType }) =>
      schemaType === "proyecto" ? [...badges, EstadoBadge] : badges,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
