import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons/Document";

const idSinDraft = (doc?: { _id?: string }) =>
  (doc?._id ?? "").replace(/^drafts\./, "");
const soloEn =
  (...ids: string[]) =>
  ({ document }: { document?: { _id?: string } }) =>
    !ids.includes(idSinDraft(document));

const items = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    hidden: soloEn("pagina-nosotros"),
    of: [
      defineArrayMember({
        type: "object",
        name: "item",
        fields: [
          defineField({ name: "titulo", title: "Título", type: "string" }),
          defineField({ name: "texto", title: "Texto", type: "text", rows: 3 }),
        ],
        preview: { select: { title: "titulo", subtitle: "texto" } },
      }),
    ],
  });

/** Inner page (Cocinas, Mobiliario, Proyectos, Nosotros, Contacto) — one fixed document each. */
export const pagina = defineType({
  name: "pagina",
  title: "Página",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "etiqueta", title: "Antetítulo", type: "string" }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introducción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "imagen",
      title: "Imagen principal",
      type: "fotografia",
      hidden: ({ document }) =>
        ["pagina-terminos", "pagina-privacidad"].includes(idSinDraft(document)),
    }),
    defineField({
      name: "actualizado",
      title: "Última actualización",
      type: "date",
      options: { dateFormat: "D [de] MMMM [de] YYYY" },
      hidden: soloEn("pagina-terminos", "pagina-privacidad"),
    }),
    defineField({
      name: "texto",
      title: "Texto",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Título de sección", value: "h2" },
            { title: "Subtítulo", value: "h3" },
          ],
        }),
      ],
    }),
    defineField({
      name: "imagenes",
      title: "Fotografías adicionales",
      type: "array",
      of: [defineArrayMember({ type: "fotografia" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "videos",
      title: "Videos de la página",
      type: "array",
      description:
        "Se muestran junto a los videos de proyectos de esta sección (según su tipo de trabajo).",
      hidden: soloEn("pagina-cocinas", "pagina-mobiliario"),
      of: [defineArrayMember({ type: "video" })],
    }),

    // Nosotros
    defineField({
      name: "cifras",
      title: "Cifras",
      type: "array",
      description: 'Ej: "12" · "Años de experiencia". Si está vacío no se muestra.',
      hidden: soloEn("pagina-nosotros"),
      of: [
        defineArrayMember({
          type: "object",
          name: "cifra",
          fields: [
            defineField({ name: "valor", title: "Valor", type: "string" }),
            defineField({ name: "etiqueta", title: "Etiqueta", type: "string" }),
          ],
          preview: { select: { title: "valor", subtitle: "etiqueta" } },
        }),
      ],
    }),
    defineField({
      name: "cita",
      title: "Frase destacada",
      type: "text",
      rows: 3,
      hidden: soloEn("pagina-nosotros"),
    }),
    defineField({
      name: "citaAutor",
      title: "Autor de la frase",
      type: "string",
      hidden: soloEn("pagina-nosotros"),
    }),
    defineField({
      name: "procesoTitulo",
      title: "Título del proceso",
      type: "string",
      hidden: soloEn("pagina-nosotros"),
    }),
    items("proceso", "Pasos del proceso", "Se numeran en orden."),
    defineField({
      name: "valoresTitulo",
      title: "Título de compromisos",
      type: "string",
      hidden: soloEn("pagina-nosotros"),
    }),
    items("valores", "Compromisos"),
  ],
  preview: { select: { title: "titulo", media: "imagen" } },
});
